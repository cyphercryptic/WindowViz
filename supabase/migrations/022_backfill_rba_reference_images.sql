-- Backfill reference_image_url for existing Renewal by Andersen Acclaim products
-- seeded before 021 added the column. Matches rows by brand + line + windowType
-- and only touches rows where reference_image_url IS NULL so hand-edited URLs are
-- preserved. URLs mirror src/lib/master-products/windows.ts — keep in sync if that
-- file changes.

-- Specialty shapes first (line='Acclaim Specialty'). Both Circle Top and
-- Geometric Trapezoid store windowType='picture' in attributes, so matching on
-- line instead of windowType keeps them distinct from the Acclaim picture SKUs.
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/windows/specialty-windows/pdp-gallery/product-gallery_specialty_black-exterior-arch-tops_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND line = 'Acclaim Specialty'
  AND reference_image_url IS NULL;

-- Acclaim operable types — match by windowType + line='Acclaim' so we don't
-- accidentally touch specialty rows (which also have windowType='picture').
UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/windows/double-hung/pdp-gallery/product-gallery_double-hung_exterior-row-home_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND line = 'Acclaim'
  AND attributes->>'windowType' = 'double-hung'
  AND reference_image_url IS NULL;

UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/windows/casement/pdp-gallery/product-gallery_casement_stairwell_white-open-windows_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND line = 'Acclaim'
  AND attributes->>'windowType' = 'casement'
  AND reference_image_url IS NULL;

UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/windows/awning-windows/pdp-gallery/product-gallery_awning_exterior-of-home-with-an-awning-window_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND line = 'Acclaim'
  AND attributes->>'windowType' = 'awning'
  AND reference_image_url IS NULL;

UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/windows/sliding-windows/pdp-gallery/product-gallery_sliding_family-room.jpg'
WHERE brand = 'Renewal by Andersen'
  AND line = 'Acclaim'
  AND attributes->>'windowType' = 'sliding'
  AND reference_image_url IS NULL;

UPDATE products
SET reference_image_url = 'https://www.renewalbyandersen.com/-/media/Project/AndersenCorporation/RenewalByAndersen/RenewalByAndersen/images/components/products/windows/picture-windows/pdp-gallery/product-gallery_picture_tall-ceilings-and-patio-door_1x1.jpg'
WHERE brand = 'Renewal by Andersen'
  AND line = 'Acclaim'
  AND attributes->>'windowType' = 'picture'
  AND reference_image_url IS NULL;
