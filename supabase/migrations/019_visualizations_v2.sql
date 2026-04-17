-- Extend visualizations table for perspective and category tracking

ALTER TABLE visualizations
  ADD COLUMN perspective TEXT DEFAULT 'exterior' CHECK (perspective IN ('exterior', 'interior')),
  ADD COLUMN category product_category;

COMMENT ON COLUMN visualizations.perspective IS 'Whether the photo is taken from outside or inside the house';
COMMENT ON COLUMN visualizations.category IS 'Denormalized product category for quick filtering';
