import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Perspective } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Detect whether a photo is taken from exterior or interior using Gemini Flash.
 * Fast text-only call — no image generation.
 */
export async function detectPerspective(imageBuffer: Buffer): Promise<Perspective> {
  const base64Image = imageBuffer.toString('base64');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const response = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/png',
        data: base64Image,
      },
    },
    {
      text: 'Is this photo taken from the exterior (outside) or interior (inside) of a building? Respond with exactly one word: "exterior" or "interior".',
    },
  ]);

  const text = response.response.text()?.trim().toLowerCase() || '';
  if (text.includes('interior')) return 'interior';
  return 'exterior';
}

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  // Retry on transient Gemini capacity/network errors
  return /\b(503|502|504|429|overloaded|unavailable|high demand|timeout|ECONNRESET|ETIMEDOUT)\b/i.test(msg);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch an image URL and return a Gemini-ready inlineData part.
 * Returns null on any fetch failure so a missing reference doesn't kill the whole call.
 */
async function fetchInlinePart(
  url: string
): Promise<{ inlineData: { mimeType: string; data: string } } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/png';
    // Gemini accepts common image types — default to png if unknown
    const mimeType = contentType.startsWith('image/') ? contentType.split(';')[0] : 'image/png';
    const arrayBuf = await res.arrayBuffer();
    const data = Buffer.from(arrayBuf).toString('base64');
    return { inlineData: { mimeType, data } };
  } catch {
    return null;
  }
}

export async function generateVisualization(
  imageBuffer: Buffer,
  prompt: string,
  options: { referenceImageUrl?: string | null } = {}
): Promise<Buffer> {
  const base64Image = imageBuffer.toString('base64');

  // Nano Banana 2 — released Feb 2026. Materially better prompt adherence,
  // text rendering, and color fidelity than gemini-2.5-flash-image (the
  // previous model). Same SDK, same auth, ~$0.065/image (vs $0.04 before).
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-image-preview',
    generationConfig: {
      // @ts-expect-error - responseModalities is supported but not in types yet
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  // Load optional reference image (few-shot visual target for the AI)
  const referencePart = options.referenceImageUrl
    ? await fetchInlinePart(options.referenceImageUrl)
    : null;

  // Build the content parts. When a reference is present, it comes FIRST with a label,
  // then the source photo, then the prompt. Labels help Gemini associate each image with its role.
  const buildParts = () => {
    const parts: Array<
      | { inlineData: { mimeType: string; data: string } }
      | { text: string }
    > = [];

    if (referencePart) {
      parts.push({
        text: 'REFERENCE IMAGE — use this ONLY to learn the window STYLE, SHAPE, and PROPORTIONS (e.g. is it a double-hung, casement, awning, slider, picture). IGNORE the color of the windows in this reference image completely. The actual color for the new windows comes from the text instructions below, NOT from this image:',
      });
      parts.push(referencePart);
      parts.push({
        text: 'SOURCE PHOTO — this is the house photo you will edit. Replace the existing windows with new windows whose STYLE matches the reference image above, but whose COLOR is specified in the text instructions at the end:',
      });
    }

    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: base64Image,
      },
    });
    parts.push({ text: prompt });
    return parts;
  };

  // Nano Banana 2 takes 20-30s per call (harder colors / contrasts can spike
  // higher). The visualize route sets maxDuration = 300, which leaves room
  // for a couple of retries on transient 429/503s without risking a hard
  // platform timeout.
  const maxAttempts = 3;
  // Backoff schedule between attempts
  const backoffs = [2000, 5000];
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await model.generateContent(buildParts());

      const parts = response.response.candidates?.[0]?.content?.parts;
      if (!parts) {
        throw new Error('No response from Gemini');
      }

      for (const part of parts) {
        if (part.inlineData?.data) {
          return Buffer.from(part.inlineData.data, 'base64');
        }
      }

      throw new Error('No image data returned from Gemini');
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts && isRetryableError(err)) {
        await sleep(backoffs[attempt - 1]);
        continue;
      }
      throw err;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error('Failed to generate visualization');
}
