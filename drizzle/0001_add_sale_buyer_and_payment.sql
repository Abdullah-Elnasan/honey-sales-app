ALTER TABLE "sales"
  ADD COLUMN IF NOT EXISTS "buyer_name" text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "payment_received" boolean NOT NULL DEFAULT false;
