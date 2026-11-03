import { pgTable, serial, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core'

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
  saleDate: timestamp('sale_date', { withTimezone: true }).defaultNow().notNull(),
})