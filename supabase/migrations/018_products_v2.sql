-- Extend products table for window/door categories with JSONB attributes
-- Drop roofing-specific 'style' column, add category, material, and attributes

ALTER TABLE products
  ADD COLUMN category product_category NOT NULL DEFAULT 'window',
  ADD COLUMN material TEXT,
  ADD COLUMN attributes JSONB DEFAULT '{}';

ALTER TABLE products DROP COLUMN IF EXISTS style;

-- Index for filtering by category
CREATE INDEX idx_products_category ON products(tenant_id, category);

-- GIN index for querying JSONB attributes
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);

COMMENT ON COLUMN products.category IS 'Product type: window, sliding_glass_door, or entry_door';
COMMENT ON COLUMN products.material IS 'Frame/door material: vinyl, wood, fiberglass, aluminum, composite, steel, clad-wood';
COMMENT ON COLUMN products.attributes IS 'Category-specific configuration as JSONB (window type, glass type, hardware, etc.)';
