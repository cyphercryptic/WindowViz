-- Backfill/cleanup for Renewal by Andersen patio doors and entry doors.
-- Mirrors the catalog updates in src/lib/master-products/sliding-doors.ts and
-- entry-doors.ts. Keeps visualization history intact (soft-delete, no FK breaks).
-- Idempotent — WHERE clauses prevent double-writes.

BEGIN;

-- ============================================================================
-- 1. Rename Sandstone → Sandtone in every RbA door product
-- ============================================================================
UPDATE products
SET color = 'Sandtone',
    name = REPLACE(name, 'Sandstone', 'Sandtone')
WHERE brand = 'Renewal by Andersen'
  AND category IN ('sliding_glass_door', 'entry_door')
  AND color = 'Sandstone';

-- ============================================================================
-- 2. Soft-delete patio door colors no longer offered
--    (Match old list vs new — only 'Dark Bronze' was in old list and stays.
--     Old colors: White, Canvas, Sandstone, Terratone, Dark Bronze, Black
--     New colors: White, Sandtone, Canvas, Terratone, Forest Green, Dark Bronze, Black
--     → no patio door colors to remove; Sandstone rename above handles it.)
-- ============================================================================

-- ============================================================================
-- 3. Soft-delete Ensemble entry door colors not offered by RbA
--    (Driftwood, Prairie Grass, Sage, Boysenberry, Red Rock — none in 2026 palette)
-- ============================================================================
UPDATE products
SET is_active = false
WHERE brand = 'Renewal by Andersen'
  AND category = 'entry_door'
  AND color IN ('Driftwood', 'Prairie Grass', 'Sage', 'Boysenberry', 'Red Rock');

-- ============================================================================
-- 4. Backfill reference_image_url for patio doors by line + panel count
-- ============================================================================
-- 200 Series — any panels — sliding reference
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/product-intro-images_gpd/product-intro-image_patio_200-series_1x1.png'
WHERE brand = 'Renewal by Andersen'
  AND category = 'sliding_glass_door'
  AND line = '200 Series'
  AND reference_image_url IS NULL;

-- 400 Series Frenchwood Hinged (both inswing and outswing)
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/product-intro-images_gpd/product-intro-image_patio_400-series_hinged_black_1x1.png'
WHERE brand = 'Renewal by Andersen'
  AND category = 'sliding_glass_door'
  AND line = '400 Series Frenchwood'
  AND name ILIKE '%Hinged%'
  AND reference_image_url IS NULL;

-- 400 Series Frenchwood Gliding (sliding, all panel counts)
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/product-intro-images_gpd/product-intro-image_patio_400-series_sliding_terratone_1x1/product-intro-image_patio_400-series_sliding_1x1.PNG'
WHERE brand = 'Renewal by Andersen'
  AND category = 'sliding_glass_door'
  AND line = '400 Series Frenchwood'
  AND name ILIKE '%Gliding%'
  AND reference_image_url IS NULL;

-- A-Series Hinged French
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/product-intro-images_gpd/product-intro-image_patio_a-series_hinged_1x1.png'
WHERE brand = 'Renewal by Andersen'
  AND category = 'sliding_glass_door'
  AND line = 'A-Series'
  AND name ILIKE '%Hinged%'
  AND reference_image_url IS NULL;

-- A-Series Contemporary Sliding (all panel counts)
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/product-intro-images_gpd/product-intro-image_patio_a-series_sliding_1x1.png'
WHERE brand = 'Renewal by Andersen'
  AND category = 'sliding_glass_door'
  AND line = 'A-Series'
  AND name ILIKE '%Sliding%'
  AND reference_image_url IS NULL;

-- ============================================================================
-- 5. Backfill reference_image_url for Ensemble entry doors by family (line)
-- ============================================================================
-- Solid Panel family
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/doors/entry-doors/pdp-gallery/product-gallery_entry_single_black_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND category = 'entry_door'
  AND line = 'Ensemble Solid Panel'
  AND reference_image_url IS NULL;

-- Full Light family
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/doors/entry-doors/pdp-gallery/product-gallery_entry-single_black-full-light_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND category = 'entry_door'
  AND line IN ('Ensemble Full Light', 'Ensemble Three-Quarter Light')
  AND reference_image_url IS NULL;

-- Half Light family
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/doors/entry-doors/pdp-gallery/product-gallery_entry-single-sidelight_red-mid-century_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND category = 'entry_door'
  AND line = 'Ensemble Half Light'
  AND reference_image_url IS NULL;

-- Oval Light family
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/product-intro-images_gpd/product-intro-image_entry_single-sidelight_modern_tb_1x1.png'
WHERE brand = 'Renewal by Andersen'
  AND category = 'entry_door'
  AND line = 'Ensemble Oval Light'
  AND reference_image_url IS NULL;

-- Craftsman Light family
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/doors/entry-doors/pdp-gallery/product-gallery_entry-single-sidelight_black-craftsman_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND category = 'entry_door'
  AND line = 'Ensemble Craftsman Light'
  AND reference_image_url IS NULL;

-- Specialty Light family
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/doors/entry-doors/pdp-gallery/product-gallery_entry-dual-sidelight_black-modern_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND category = 'entry_door'
  AND line = 'Ensemble Specialty Light'
  AND reference_image_url IS NULL;

-- ============================================================================
-- 6. Sanity check — count rows per line, with/without reference_image_url
-- ============================================================================
SELECT
  category,
  line,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE is_active) AS active,
  COUNT(reference_image_url) AS with_ref
FROM products
WHERE brand = 'Renewal by Andersen'
  AND category IN ('sliding_glass_door', 'entry_door')
GROUP BY category, line
ORDER BY category, line;

COMMIT;
