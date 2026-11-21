import { eq, sql } from 'drizzle-orm'
import { db } from './db'
import { invoiceItems, invoices } from './schema'

export const PRODUCT_TYPES = ['honey', 'ghee'] as const
export type ProductType = typeof PRODUCT_TYPES[number]

export function isProductType(value: unknown): value is ProductType {
  return typeof value === 'string' && (PRODUCT_TYPES as readonly string[]).includes(value)
}

export const round2 = (n: number) => Math.round(n * 100) / 100

export function parseInvoiceId(raw: string | undefined) {
  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'رقم الفاتورة غير صحيح' })
  }
  return id
}

// مجموع الدفعات لفاتورة (استعلام فرعي مرتبط — يُنفَّذ داخل نفس استعلام SQL)
// ملاحظة: مكتوب نصاً بالكامل عمداً. db.query يعيد كتابة مراجع الأعمدة داخل extras
// (إلى "invoices"."amount" أو "id" بدون جدول، فيُطابق p.id خطأً). الجدول الجذر اسمه
// المستعار invoices في كل الاستعلامات التي تستخدم هذا التعبير.
const totalPaidSql = () =>
  sql<string>`(select coalesce(sum(p.amount), 0) from payments p where p.invoice_id = invoices.id)`

// الفواتير التي تحتوي على صنف من النوع المطلوب
const invoiceIdsWithType = (type: ProductType) =>
  db.select({ id: invoiceItems.invoiceId }).from(invoiceItems).where(eq(invoiceItems.productType, type))

// GET /api/invoices — الفواتير مع الأصناف المتداخلة ومجموع الدفعات
export function listInvoices(type?: ProductType) {
  return db.query.invoices.findMany({
    where: type ? (t, { inArray }) => inArray(t.id, invoiceIdsWithType(type)) : undefined,
    orderBy: (t, { desc }) => [desc(t.createdAt), desc(t.id)],
    with: { items: { orderBy: (t, { asc }) => [asc(t.id)] } },
    extras: { totalPaid: totalPaidSql().as('total_paid') },
  })
}

// GET /api/invoices/:id — الفاتورة مع الأصناف والدفعات
export function getInvoice(id: number) {
  return db.query.invoices.findFirst({
    where: (t, { eq }) => eq(t.id, id),
    with: {
      items: { orderBy: (t, { asc }) => [asc(t.id)] },
      payments: { orderBy: (t, { asc }) => [asc(t.date), asc(t.id)] },
    },
    extras: { totalPaid: totalPaidSql().as('total_paid') },
  })
}

// ملخص الدفع فقط (للتحقق قبل إضافة دفعة)
export async function getInvoiceBalance(id: number) {
  const [row] = await db.select({ total: invoices.total, totalPaid: totalPaidSql() })
    .from(invoices).where(eq(invoices.id, id))
  if (!row) return null
  const total = Number(row.total)
  return { total, totalPaid: Number(row.totalPaid), remaining: round2(total - Number(row.totalPaid)) }
}

interface ItemRow {
  id: number
  productType: ProductType
  productName: string
  quantity: string
  pricePerKg: string
  lineTotal: string
}

interface InvoiceRow {
  id: number
  total: string
  createdAt: Date
  totalPaid: string | number
  items: ItemRow[]
}

export function toInvoiceDto<T extends InvoiceRow>(row: T) {
  const total = Number(row.total)
  const totalPaid = Number(row.totalPaid)
  const items = row.items.map(i => ({
    id: i.id,
    productType: i.productType,
    productName: i.productName,
    quantity: Number(i.quantity),
    pricePerKg: Number(i.pricePerKg),
    lineTotal: Number(i.lineTotal),
  }))
  return {
    id: row.id,
    createdAt: row.createdAt,
    total,
    totalPaid,
    remaining: round2(total - totalPaid),
    itemsCount: items.length,
    totalQuantity: round2(items.reduce((s, i) => s + i.quantity, 0)),
    productTypes: PRODUCT_TYPES.filter(t => items.some(i => i.productType === t)),
    items,
  }
}
