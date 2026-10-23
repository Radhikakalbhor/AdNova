import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'image.pollinations.ai',
  'pollinations.ai',
  'images.unsplash.com',
  'images.pexels.com',
  'cdn.pixabay.com',
  'res.cloudinary.com',
  'huggingface.co',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Only allow secure HTTPS and authorized image hosts
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTPS URLs are supported' }, { status: 400 });
    }

    const host = parsedUrl.hostname.toLowerCase();
    const isAllowed = ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));

    if (!isAllowed) {
      return NextResponse.json(
        { error: `Host ${host} is not in the allowed domains list` },
        { status: 403 }
      );
    }

    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(25000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*',
      },
    });

    let finalResponse = response;

    if (!finalResponse.ok) {
      let details = '';
      try {
        details = await finalResponse.text();
      } catch {}

      // If upstream has a short rate-limit cooldown (e.g. 1-4 seconds), wait and retry once server-side
      if (finalResponse.status === 402 || finalResponse.status === 429) {
        const match = details.match(/Retry after (\d+)s/i);
        const retrySec = match ? parseInt(match[1], 10) : 0;
        if (retrySec > 0 && retrySec <= 6) {
          await new Promise((resolve) => setTimeout(resolve, (retrySec + 0.6) * 1000));
          try {
            const retryRes = await fetch(imageUrl, {
              signal: AbortSignal.timeout(25000),
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*',
              },
            });
            if (retryRes.ok) {
              finalResponse = retryRes;
            }
          } catch {
            // Keep original error
          }
        }
      }

      if (!finalResponse.ok) {
        return NextResponse.json(
          {
            error: `Upstream image server responded with ${finalResponse.status}`,
            status: finalResponse.status,
            details,
          },
          { status: finalResponse.status }
        );
      }
    }

    const contentType = finalResponse.headers.get('content-type') || 'image/jpeg';
    const buffer = await finalResponse.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to proxy image', details: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
