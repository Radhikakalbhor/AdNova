import { NextRequest, NextResponse } from 'next/server';
import { AdInput, GenerateApiResponse } from '@/types/ad';
import { generateAdVariationsWithGroq, extractGroqErrorInfo, ensureExactVariationCount } from '@/lib/groq';
import { processAndValidateVariation } from '@/lib/adProcessor';
import { buildVisualCreative } from '@/lib/artDirector';

const VALID_PLATFORMS = ['google', 'meta'];
const VALID_FRAMEWORKS = ['aida', 'pas'];
const VALID_TONES = ['Professional', 'Friendly', 'Persuasive', 'Urgent', 'Creative'];
const VALID_OBJECTIVES = ['Awareness', 'Traffic', 'Leads', 'Sales'];

export async function POST(req: NextRequest): Promise<NextResponse<GenerateApiResponse>> {
  try {
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return NextResponse.json(
        {
          success: false,
          error: 'Groq API key is missing or not configured.',
          details: 'Please add your GROQ_API_KEY to your .env.local file. Get a free key at https://console.groq.com/keys',
        },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON request payload.',
          details: 'Request body must be valid JSON.',
        },
        { status: 400 }
      );
    }

    // Input Validation
    const productName = typeof body.productName === 'string' ? body.productName.trim() : '';
    const productDescription = typeof body.productDescription === 'string' ? body.productDescription.trim() : '';
    const targetAudience = typeof body.targetAudience === 'string' ? body.targetAudience.trim() : '';
    const platform = body.platform;
    const framework = body.framework;
    const tone = body.tone;
    const objective = body.objective;
    const variationCount = Number(body.variationCount) || 3;
    const offerKeywords = typeof body.offerKeywords === 'string' ? body.offerKeywords.trim() : undefined;

    if (!productName) {
      return NextResponse.json(
        { success: false, error: 'Product or service name is required.' },
        { status: 400 }
      );
    }
    if (productName.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Product name must be 200 characters or fewer.' },
        { status: 400 }
      );
    }

    if (!productDescription) {
      return NextResponse.json(
        { success: false, error: 'Product description or key features are required.' },
        { status: 400 }
      );
    }
    if (productDescription.length > 4000) {
      return NextResponse.json(
        { success: false, error: 'Product description must be 4000 characters or fewer.' },
        { status: 400 }
      );
    }

    if (!targetAudience) {
      return NextResponse.json(
        { success: false, error: 'Target audience is required.' },
        { status: 400 }
      );
    }
    if (targetAudience.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Target audience must be 500 characters or fewer.' },
        { status: 400 }
      );
    }

    if (!VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { success: false, error: 'Invalid advertising platform selected (must be "google" or "meta").' },
        { status: 400 }
      );
    }

    if (!VALID_FRAMEWORKS.includes(framework)) {
      return NextResponse.json(
        { success: false, error: 'Invalid copywriting framework selected (must be "aida" or "pas").' },
        { status: 400 }
      );
    }

    if (!VALID_TONES.includes(tone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tone selected.' },
        { status: 400 }
      );
    }

    if (!VALID_OBJECTIVES.includes(objective)) {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign objective selected.' },
        { status: 400 }
      );
    }

    const clampedVariationCount = Math.min(Math.max(variationCount, 1), 5);

    const validatedInput: AdInput = {
      productName,
      productDescription,
      targetAudience,
      platform,
      framework,
      tone,
      objective,
      variationCount: clampedVariationCount,
      offerKeywords,
    };

    // Execute Generation with Groq (at most one controlled retry on malformed response)
    let rawVariations: any[] = [];
    let modelUsed = 'openai/gpt-oss-20b';
    let attempts = 0;
    const maxAttempts = 2;
    let lastError: any = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const result = await generateAdVariationsWithGroq(validatedInput, apiKey);
        if (result && Array.isArray(result.variations) && result.variations.length >= clampedVariationCount) {
          rawVariations = result.variations.slice(0, clampedVariationCount);
          modelUsed = result.modelUsed;
          break;
        } else if (result && Array.isArray(result.variations) && result.variations.length > 0) {
          rawVariations = result.variations;
          modelUsed = result.modelUsed;
          console.warn(`[AdNova Route] Model returned ${result.variations.length} variations (requested ${clampedVariationCount}).`);
          if (rawVariations.length >= clampedVariationCount) {
            break;
          }
        }
      } catch (err: any) {
        lastError = err;
        const errInfo = extractGroqErrorInfo(err);

        // Fail immediately on authentication / invalid key error
        if (errInfo.isInvalidKey) {
          break;
        }

        console.warn(`[AdNova Route] Groq generation attempt ${attempts} failed, retrying once if available...`);
      }
    }

    // Guarantee that rawVariations contains exactly clampedVariationCount variations
    if (rawVariations && rawVariations.length > 0 && rawVariations.length < clampedVariationCount) {
      rawVariations = ensureExactVariationCount(rawVariations, clampedVariationCount, validatedInput);
    } else if (rawVariations && rawVariations.length > clampedVariationCount) {
      rawVariations = rawVariations.slice(0, clampedVariationCount);
    }

    if (!rawVariations || rawVariations.length === 0) {
      const errorInfo = extractGroqErrorInfo(lastError);

      let httpStatus = 502;
      let friendlyMessage = 'Failed to generate ad copy variations with Groq.';
      let detailsMessage = 'The AI model could not return a valid response after controlled retry.';

      if (errorInfo.isInvalidKey) {
        httpStatus = 401;
        friendlyMessage = 'The provided Groq API key is invalid or unauthorized (HTTP 401).';
        detailsMessage = 'Please verify that GROQ_API_KEY in your .env.local file matches your key from Groq Console (https://console.groq.com/keys) exactly.';
      } else if (errorInfo.isRateLimit) {
        httpStatus = 429;
        friendlyMessage = 'Groq API rate limit reached (HTTP 429).';
        detailsMessage = 'Rate limit or tokens-per-minute ceiling reached on Groq free tier. Please wait a moment and try again.';
      } else if (errorInfo.isModelNotFound) {
        httpStatus = 502;
        friendlyMessage = 'Configured Groq model is currently unavailable.';
        detailsMessage = errorInfo.message;
      } else if (errorInfo.message) {
        detailsMessage = errorInfo.message;
      }

      console.error('[AdNova Route Error]', {
        httpStatus,
        friendlyMessage,
        detailsMessage,
      });

      return NextResponse.json(
        {
          success: false,
          error: friendlyMessage,
          details: detailsMessage,
        },
        { status: httpStatus }
      );
    }

    // Process and validate variations with character counts, limits, and visual creatives
    const processedVariations = rawVariations.map((v, idx) => {
      const base = processAndValidateVariation(v, idx, platform, framework);
      const visualCreative = buildVisualCreative(
        v,
        idx,
        productName,
        productDescription,
        platform,
        offerKeywords
      );
      return {
        ...base,
        visualCreative,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        variations: processedVariations,
        framework,
        platform,
        modelUsed,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    const errorInfo = extractGroqErrorInfo(err);
    console.error('[AdNova Route Uncaught Error]', errorInfo.message);

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected server error occurred.',
        details: 'Please check your inputs and server logs, then try again.',
      },
      { status: 500 }
    );
  }
}
