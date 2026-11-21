# Run & Test Locally Before Pushing

Steps to run the honey sales app (Nuxt 4 + Drizzle + Neon Postgres) on your machine and verify the **Supplier Invoices / Payments** and **Honey / Ghee** features before committing and pushing.

Commands are written for **PowerShell** on Windows.

---

## 1. Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 20 or newer (tested on 24) | `node -v` |
| pnpm | 9 or newer | `pnpm -v` (install: `npm i -g pnpm`) |
| PostgreSQL client *(optional)* | any | `psql --version` |

You also need a PostgreSQL database URL (Neon or a local Postgres).

> ⚠️ **Do not test against the production database.** In Neon, create a separate branch (e.g. `dev`) from your main branch and use its connection string. The migration below changes the schema.

---

## 2. Go to the feature branch

The work lives on branch `worktree-invoices-ghee`.

```powershell
# Option A – use the existing worktree folder
cd D:\abd.dev.pro\honey-sales-app\.claude\worktrees\invoices-ghee

# Option B – check the branch out in the main folder
cd D:\abd.dev.pro\honey-sales-app
git checkout worktree-invoices-ghee
```

---

## 3. Install dependencies

```powershell
pnpm install
```

---

## 4. Create the `.env` file

Create a file named `.env` in the project root. It is git-ignored, so it will never be committed.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

Use the connection string of your **dev** database.

---

## 5. Apply the database migrations

The migrations are plain SQL files in `drizzle/`. They are safe to re-run (`IF NOT EXISTS`). Run them **in order**:

| File | What it does |
|------|--------------|
| `0000_add_period_name.sql` | Adds `name` to periods |
| `0001_add_sale_buyer_and_payment.sql` | Adds buyer name and payment status to sales |
| `0002_add_invoices_payments_and_product_type.sql` | `product_type` enum, `invoices` and `payments` tables, `honey_types.category` |
| `0003_invoice_line_items.sql` | **New:** `invoice_items` table; moves old single-product invoices into one item each, then drops `type/quantity/price_per_kg` from `invoices` |

**Option A: Neon SQL Editor (no install needed)**
Open the Neon console, select your **dev** branch, open *SQL Editor*, paste each file's contents, and run them.

**Option B: psql**

```powershell
$env:DATABASE_URL = "postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
psql $env:DATABASE_URL -f drizzle/0000_add_period_name.sql
psql $env:DATABASE_URL -f drizzle/0001_add_sale_buyer_and_payment.sql
psql $env:DATABASE_URL -f drizzle/0002_add_invoices_payments_and_product_type.sql
psql $env:DATABASE_URL -f drizzle/0003_invoice_line_items.sql
```

Verify the tables exist:

```powershell
psql $env:DATABASE_URL -c "\dt"
```

You should see `invoices`, `invoice_items` and `payments` in the list.

---

## 6. Start the dev server

```powershell
pnpm dev
```

Open **http://localhost:3000**. Nuxt reads `.env` automatically in dev mode.

---

## 7. Manual test checklist

### Feature 1: Supplier invoices and payments
- [ ] The nav shows a new **🧾 فواتير الموردين** tab.
- [ ] **New invoice** (`/invoices/new`): each row has Type, Product Name (e.g. حبة البركة), Quantity, Price per Kg and an auto Line Total.
- [ ] **+ إضافة صنف** adds a row; **حذف** removes one (disabled when only one row is left). The invoice total sums all rows.
- [ ] Save is disabled until every row is complete.
- [ ] Saving redirects to the invoice details page.
- [ ] **Details** (`/invoices/:id`): click **＋ إضافة دفعة**. A modal opens with amount, payer name, and date.
- [ ] Add a payment. It appears in the payments table, and *Total Paid* and *Remaining* update.
- [ ] An amount larger than the remaining balance is blocked (the button is disabled and the API returns 400).
- [ ] When fully paid, the button is disabled and the log shows **مسددة**.
- [ ] **Log** (`/invoices`): each row shows Invoice Total, Total Paid, and Remaining Balance.

### Feature 2: Honey / Ghee
- [ ] The **Type** filter on `/invoices` filters the list. The URL becomes `/invoices?type=ghee`.
- [ ] **Periods page**: each stock row has a **التصنيف** select (عسل / سمن عربي). Create a period with a ghee item.
- [ ] **Stats page**: the **الكل / 🍯 عسل / 🧈 سمن عربي** tabs show separate revenue, cost, and profit. The table has a *التصنيف* column.

### Regression (existing features still work)
- [ ] Create a period, record a sale (`/sales`), edit a sale (`/records`), end and delete a period.

### API quick check *(optional, with the dev server running)*

```powershell
# Create invoice
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/invoices `
  -ContentType 'application/json' -Body '{"items":[{"productType":"ghee","productName":"سمن بلدي","quantity":10,"pricePerKg":25},{"productType":"honey","productName":"حبة البركة","quantity":5,"pricePerKg":40}]}'

# Add payment to invoice 1
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/invoices/1/payments `
  -ContentType 'application/json' -Body '{"amount":100,"payerName":"Ahmed","date":"2026-11-21"}'

# List ghee invoices with totals
Invoke-RestMethod http://localhost:3000/api/invoices?type=ghee
```

---

## 8. Production build check

Make sure the app builds the same way Vercel will build it:

```powershell
pnpm build
```

It should end with `✨ Build complete`. Fix any errors before pushing.

---

## 9. Commit & push

```powershell
git status                      # confirm .env is NOT listed
git add -A
git commit -m "your message"    # skip if there is nothing new to commit
git push -u origin worktree-invoices-ghee
```

Then open a Pull Request on GitHub from `worktree-invoices-ghee` into `master`.

---

## 10. After merging (production)

1. Run the migrations that have not been applied yet, **in order** (`0002` then `0003`), on the production database **before** the new code deploys. Otherwise the API returns 500 (as happened with `/api/types` when `0002` was missing).
2. Existing honey types default to `honey`. To mark an existing type as ghee, either create a new period with that type name and the ghee category (this updates the type's category), or run:
   ```sql
   UPDATE honey_types SET category = 'ghee' WHERE name = 'سمن عربي';
   ```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `type "product_type" does not exist` or `relation "invoices" does not exist` | Migration `0002` was not applied to the DB in `.env`. Run step 5. |
| `relation "invoice_items" does not exist` | Migration `0003` was not applied. Run step 5. |
| `DATABASE_URL` undefined or connection errors | `.env` is missing, in the wrong folder, or has a typo. It must be in the project root. |
| Port 3000 is busy | `pnpm dev --port 3001` |
| Strange build errors after switching branches | Delete `.nuxt` and `node_modules`, then `pnpm install`. |
