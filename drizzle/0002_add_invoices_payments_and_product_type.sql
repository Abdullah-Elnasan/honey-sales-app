DO $$ BEGIN
  CREATE TYPE "product_type" AS ENUM ('honey', 'ghee');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- تصنيف الأنواع الحالية (كلها عسل افتراضياً)؛ المبيعات والمخزون يرثان التصنيف عبر honey_type_id
ALTER TABLE "honey_types"
  ADD COLUMN IF NOT EXISTS "category" "product_type" NOT NULL DEFAULT 'honey';

CREATE TABLE IF NOT EXISTS "invoices" (
  "id" serial PRIMARY KEY,
  "type" "product_type" NOT NULL,
  "quantity" numeric(10, 2) NOT NULL CHECK ("quantity" > 0),
  "price_per_kg" numeric(10, 2) NOT NULL CHECK ("price_per_kg" > 0),
  "total" numeric(12, 2) NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "invoices_type_idx" ON "invoices" ("type");

CREATE TABLE IF NOT EXISTS "payments" (
  "id" serial PRIMARY KEY,
  "invoice_id" integer NOT NULL REFERENCES "invoices" ("id") ON DELETE CASCADE,
  "amount" numeric(12, 2) NOT NULL CHECK ("amount" > 0),
  "payer_name" text NOT NULL,
  "date" date NOT NULL
);

CREATE INDEX IF NOT EXISTS "payments_invoice_id_idx" ON "payments" ("invoice_id");
