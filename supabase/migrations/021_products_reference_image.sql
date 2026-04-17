-- Add reference_image_url to products for few-shot image prompting with Gemini
-- When set, the reference image is sent alongside the user's photo so the AI has a visual
-- target for the window style and color.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS reference_image_url TEXT;

COMMENT ON COLUMN products.reference_image_url IS
  'Optional URL to a reference image of this product (e.g. manufacturer product photo). Sent to Gemini alongside the user photo for few-shot prompting.';
