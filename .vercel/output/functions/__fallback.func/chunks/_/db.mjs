import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, timestamp, text, serial, numeric, integer } from 'drizzle-orm/pg-core';

const periods = pgTable("periods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
const honeyTypes = pgTable("honey_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique()
});
const periodStock = pgTable("period_stock", {
  id: serial("id").primaryKey(),
  periodId: integer("period_id").references(() => periods.id, { onDelete: "cascade" }).notNull(),
  honeyTypeId: integer("honey_type_id").references(() => honeyTypes.id).notNull(),
  quantityKg: numeric("quantity_kg", { precision: 10, scale: 2 }).notNull(),
  costPerKg: numeric("cost_per_kg", { precision: 10, scale: 2 }).notNull()
});
const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  periodId: integer("period_id").references(() => periods.id, { onDelete: "cascade" }).notNull(),
  honeyTypeId: integer("honey_type_id").references(() => honeyTypes.id).notNull(),
  quantityKg: numeric("quantity_kg", { precision: 10, scale: 2 }).notNull(),
  pricePerKg: numeric("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  sellerName: text("seller_name").notNull(),
  saleDate: timestamp("sale_date", { withTimezone: true }).defaultNow().notNull()
});

const schema = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  honeyTypes: honeyTypes,
  periodStock: periodStock,
  periods: periods,
  sales: sales
}, Symbol.toStringTag, { value: 'Module' }));

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

export { periodStock as a, db as d, honeyTypes as h, periods as p, sales as s };
//# sourceMappingURL=db.mjs.map
