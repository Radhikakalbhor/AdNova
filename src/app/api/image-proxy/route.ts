import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'image.pollinations.ai',
  'pollinations.ai',
  'gen.pollinations.ai',
  'images.unsplash.com',
  'images.pexels.com',
  'cdn.pixabay.com',
  'res.cloudinary.com',
  'huggingface.co',
];

// Simple in-memory cache to avoid repeated upstream calls and rate limit exhaustion
interface CachedImage {
  buffer: ArrayBuffer;
  contentType: string;
  cachedAt: number;
}
const IMAGE_CACHE = new Map<string, CachedImage>();
const MAX_CACHE_ITEMS = 50;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function pruneCache() {
  const now = Date.now();
  for (const [key, item] of IMAGE_CACHE.entries()) {
    if (now - item.cachedAt > CACHE_TTL_MS) {
      IMAGE_CACHE.delete(key);
    }
  }
  if (IMAGE_CACHE.size > MAX_CACHE_ITEMS) {
    const oldestKey = IMAGE_CACHE.keys().next().value;
    if (oldestKey) IMAGE_CACHE.delete(oldestKey);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing url parameter', code: 'INVALID_REQUEST' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format', code: 'INVALID_REQUEST' }, { status: 400 });
    }

    // Only allow secure HTTPS and authorized image hosts
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTPS URLs are supported', code: 'UNAUTHORIZED_PROTOCOL' }, { status: 400 });
    }

    const host = parsedUrl.hostname.toLowerCase();
    const isAllowed = ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));

    if (!isAllowed) {
      return NextResponse.json(
        { error: `Host ${host} is not in the allowed domains list`, code: 'UNAUTHORIZED_HOST' },
        { status: 403 }
      );
    }

    // Check in-memory cache first
    const cached = IMAGE_CACHE.get(imageUrl);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      return new NextResponse(cached.buffer, {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          'X-Cache-Status': 'HIT',
        },
      });
    }

    // Check for optional server-side Pollinations key
    const pollenKey = process.env.POLLINATIONS_API_KEY || process.env.POLLEN_KEY;
    const requestHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*',
    };

    let fetchTargetUrl = imageUrl;
    if (pollenKey && (host.includes('pollinations.ai'))) {
      requestHeaders['Authorization'] = `Bearer ${pollenKey.trim()}`;
      // Also add ?key= parameter if not already present
      if (!parsedUrl.searchParams.has('key')) {
        parsedUrl.searchParams.set('key', pollenKey.trim());
        fetchTargetUrl = parsedUrl.toString();
      }
    }

    // Use a strict 8-second timeout so Vercel Serverless Function 10s limit is never breached
    const timeoutSignal = AbortSignal.timeout(8000);

    let response: Response;
    try {
      response = await fetch(fetchTargetUrl, {
        signal: timeoutSignal,
        headers: requestHeaders,
      });
    } catch (fetchErr: any) {
      if (fetchErr.name === 'TimeoutError' || fetchErr.name === 'AbortError') {
        return NextResponse.json(
          {
            error: 'Image generation timed out after 8s. The upstream queue is experiencing high volume.',
            code: 'TIMEOUT',
            status: 504,
          },
          { status: 504 }
        );
      }
      return NextResponse.json(
        {
          error: 'Network connectivity failure connecting to upstream image host.',
          details: fetchErr?.message || 'Unknown network error',
          code: 'NETWORK_ERROR',
          status: 502,
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      let rawText = '';
      let parsedDetails: any = null;
      try {
        rawText = await response.text();
        parsedDetails = JSON.parse(rawText);
      } catch {
        // Raw text is not JSON
      }

      // 1. Rate Limiting (HTTP 402 Free Limit or HTTP 429 Too Many Requests)
      if (response.status === 402 || response.status === 429) {
        let retryAfter = 45;
        const retryHeader = response.headers.get('retry-after');
        if (retryHeader) {
          const sec = parseInt(retryHeader, 10);
          if (!isNaN(sec) && sec > 0) retryAfter = sec;
        } else if (rawText) {
          const match = rawText.match(/Retry after (\d+)s/i);
          if (match && match[1]) {
            retryAfter = parseInt(match[1], 10);
          }
        }

        const safeDetails = parsedDetails?.error?.message || 
          (rawText && !rawText.includes('\x00') ? rawText.slice(0, 200) : 'Free anonymous rate limit reached (1 image / 45s per IP)');

        return NextResponse.json(
          {
            error: 'Free anonymous image limit reached (1 image per 45s per IP).',
            details: safeDetails,
            code: 'RATE_LIMIT',
            status: response.status,
            retryAfter,
            hasKeyConfigured: Boolean(pollenKey),
          },
          { status: response.status }
        );
      }

      // 2. Authentication failure (HTTP 401)
      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Upstream image service requires valid API authentication.',
            code: 'AUTH_REQUIRED',
            status: 401,
          },
          { status: 401 }
        );
      }

      // 3. Other upstream errors (404, 500, 502, 503)
      return NextResponse.json(
        {
          error: `Upstream image provider responded with status ${response.status}`,
          details: parsedDetails?.error?.message || rawText.slice(0, 200) || 'Upstream error',
          code: 'UPSTREAM_ERROR',
          status: response.status,
        },
        { status: response.status >= 500 ? response.status : 502 }
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Verify response is actually an image and not HTML or JSON
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        {
          error: 'Upstream server did not return a valid image payload.',
          code: 'INVALID_IMAGE_PAYLOAD',
          contentType,
          status: 502,
        },
        { status: 502 }
      );
    }

    const buffer = await response.arrayBuffer();

    // Cache the image buffer
    pruneCache();
    IMAGE_CACHE.set(imageUrl, {
      buffer,
      contentType,
      cachedAt: Date.now(),
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Cache-Status': 'MISS',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Unexpected server exception while proxying image.',
        details: err?.message || 'Unknown error',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
      { status: 500 }
    );
  }
}
