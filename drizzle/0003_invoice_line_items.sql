-- يتطلب تطبيق 0002 مسبقاً. آمن لإعادة التشغيل.
BEGIN;

CREATE TABLE IF NOT EXISTS "invoice_items" (
  "id" serial PRIMARY KEY,
  "invoice_id" integer NOT NULL REFERENCES "invoices" ("id") ON DELETE CASCADE,
  "product_type" "product_type" NOT NULL,
  "product_name" text NOT NULL,
  "quantity" numeric(10, 2) NOT NULL CHECK ("quantity" > 0),
  "price_per_kg" numeric(10, 2) NOT NULL CHECK ("price_per_kg" > 0),
  "line_total" numeric(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS "invoice_items_invoice_id_idx" ON "invoice_items" ("invoice_id");
CREATE INDEX IF NOT EXISTS "invoice_items_product_type_idx" ON "invoice_items" ("product_type");

-- نقل الفواتير القديمة (صنف واحد لكل فاتورة) إلى invoice_items قبل حذف الأعمدة
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'type'
  ) THEN
    INSERT INTO "invoice_items" ("invoice_id", "product_type", "product_name", "quantity", "price_per_kg", "line_total")
    SELECT i."id", i."type",
           CASE i."type" WHEN 'ghee' THEN 'سمن عربي' ELSE 'عسل' END,
           i."quantity", i."price_per_kg", i."total"
    FROM "invoices" i
    WHERE NOT EXISTS (SELECT 1 FROM "invoice_items" it WHERE it."invoice_id" = i."id");
  END IF;
END $$;

DROP INDEX IF EXISTS "invoices_type_idx";

-- total يبقى في invoices كمجموع line_total (يُحسب في الخادم)
ALTER TABLE "invoices"
  DROP COLUMN IF EXISTS "type",
  DROP COLUMN IF EXISTS "quantity",
  DROP COLUMN IF EXISTS "price_per_kg";

COMMIT;
