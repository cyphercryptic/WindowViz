/**
 * Product swatch image URL generator.
 * Images are stored in Supabase Storage (product-swatches bucket).
 * Falls back to null if no image is available (UI will show gradient swatch).
 *
 * TODO: Upload window/door swatch images to Supabase Storage.
 * For now, returns null — the ProductSwatch component falls back to
 * CSS gradient swatches from frame-colors.ts.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BUCKET = 'product-swatches';

function storageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Get the product image URL for a given brand/line/color combination.
 * Returns null if no image is available — the UI falls back to a CSS gradient.
 */
export function getProductImageUrl(brand: string, line: string, color: string): string | null {
  // TODO: Build image mapping once swatch photos are uploaded
  // Example path: andersen/400-series/white.jpg
  // return storageUrl(`${slugify(brand)}/${slugify(line)}/${slugify(color)}.jpg`);
  return null;
}
