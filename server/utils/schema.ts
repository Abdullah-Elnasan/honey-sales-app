import { relations } from 'drizzle-orm'
import { pgTable, pgEnum, serial, text, timestamp, numeric, integer, boolean, date, index } from 'drizzle-orm/pg-core'

// نوع المنتج: عسل أو سمن عربي
export const productType = pgEnum('product_type', ['honey', 'ghee'])

// جدول الفترات
export const periods = pgTable('periods', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// جدول أنواع العسل (للتخزين المسبق للأنواع)
export const honeyTypes = pgTable('honey_types', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  // تصنيف المنتج (عسل/سمن) — المبيعات والمخزون يرثانه عبر honey_type_id
  category: productType('category').notNull().default('honey'),
})

// جدول مخزون الفترة (الكميات المتاحة لكل نوع في كل فترة)
export const periodStock = pgTable('period_stock', {
  id: serial('id').primaryKey(),
  periodId: integer('period_id').references(() => periods.id, { onDelete: 'cascade' }).notNull(),
  honeyTypeId: integer('honey_type_id').references(() => honeyTypes.id).notNull(),
  quantityKg: numeric('quantity_kg', { precision: 10, scale: 2 }).notNull(),
  costPerKg: numeric('cost_per_kg', { precision: 10, scale: 2 }).notNull(),
})

// جدول المبيعات
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  periodId: integer('period_id').references(() => periods.id, { onDelete: 'cascade' }).notNull(),
  honeyTypeId: integer('honey_type_id').references(() => honeyTypes.id).notNull(),
  quantityKg: numeric('quantity_kg', { precision: 10, scale: 2 }).notNull(),
  pricePerKg: numeric('price_per_kg', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
  sellerName: text('seller_name').notNull(),
  buyerName: text('buyer_name').notNull().default(''),
  paymentReceived: boolean('payment_received').notNull().default(false),
  saleDate: timestamp('sale_date', { withTimezone: true }).defaultNow().notNull(),
})

// فواتير الموردين (رأس الفاتورة) — total = مجموع line_total للأصناف، يُحسب في الخادم
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// أصناف الفاتورة
export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }).notNull(),
  productType: productType('product_type').notNull(),
  productName: text('product_name').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  pricePerKg: numeric('price_per_kg', { precision: 10, scale: 2 }).notNull(),
  lineTotal: numeric('line_total', { precision: 12, scale: 2 }).notNull(),
}, t => [
  index('invoice_items_invoice_id_idx').on(t.invoiceId),
  index('invoice_items_product_type_idx').on(t.productType),
])

// دفعات الفاتورة (تفاصيل)
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  payerName: text('payer_name').notNull(),
  date: date('date', { mode: 'string' }).notNull(),
}, t => [index('payments_invoice_id_idx').on(t.invoiceId)])

// العلاقات (للاستعلامات المتداخلة db.query)
export const invoicesRelations = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
  payments: many(payments),
}))

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoiceId], references: [invoices.id] }),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
}))
