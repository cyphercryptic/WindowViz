-- Add product line column for configurator grouping
-- e.g. "Acclaim", "400 Series Frenchwood", "Ensemble Solid Panel"
ALTER TABLE products ADD COLUMN line TEXT;

COMMENT ON COLUMN products.line IS 'Product line within the brand, used for configurator grouping';
