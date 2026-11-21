import { eq, sql } from 'drizzle-orm'
import { db } from './db'
import { invoices, payments } from './schema'

export const PRODUCT_TYPES = ['honey', 'ghee'] as const
export type ProductType = typeof PRODUCT_TYPES[number]

export function isProductType(value: unknown): value is ProductType {
  return typeof value === 'string' && (PRODUCT_TYPES as readonly string[]).includes(value)
}

export const round2 = (n: number) => Math.round(n * 100) / 100

// الأعمدة المشتركة للفاتورة مع مجموع الدفعات (LEFT JOIN + SUM)
export const totalPaidSql = sql<string>`coalesce(sum(${payments.amount}), 0)`

export const invoiceSummaryColumns = {
  id: invoices.id,
  type: invoices.type,
  quantity: invoices.quantity,
  pricePerKg: invoices.pricePerKg,
  total: invoices.total,
  createdAt: invoices.createdAt,
  totalPaid: totalPaidSql,
  paymentsCount: sql<number>`count(${payments.id})::int`,
}

export function invoiceSummaryQuery() {
  return db.select(invoiceSummaryColumns)
    .from(invoices)
    .leftJoin(payments, eq(payments.invoiceId, invoices.id))
    .groupBy(invoices.id)
    .$dynamic()
}

interface SummaryRow {
  id: number
  type: ProductType
  quantity: string
  pricePerKg: string
  total: string
  createdAt: Date
  totalPaid: string | number
  paymentsCount: string | number
}

export function toInvoiceSummary(row: SummaryRow) {
  const total = Number(row.total)
  const totalPaid = Number(row.totalPaid)
  return {
    id: row.id,
    type: row.type,
    quantity: Number(row.quantity),
    pricePerKg: Number(row.pricePerKg),
    total,
    totalPaid,
    remaining: round2(total - totalPaid),
    paymentsCount: Number(row.paymentsCount),
    createdAt: row.createdAt,
  }
}

export function parseInvoiceId(raw: string | undefined) {
  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'رقم الفاتورة غير صحيح' })
  }
  return id
}
