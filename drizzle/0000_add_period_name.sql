ALTER TABLE "periods" ADD COLUMN IF NOT EXISTS "name" text;

UPDATE "periods"
SET "name" = 'فترة ' || to_char("start_date", 'YYYY-MM-DD')
WHERE "name" IS NULL;

ALTER TABLE "periods" ALTER COLUMN "name" SET NOT NULL;
