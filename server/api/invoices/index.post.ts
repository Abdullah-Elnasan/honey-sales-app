import { sql } from 'drizzle-orm'
import { db } from '../../utils/db'
import { invoiceItems, invoices } from '../../utils/schema'
import { getInvoice, isProductType, round2, toInvoiceDto } from '../../utils/invoices'

const MAX_ITEMS = 200

// POST /api/invoices
// body: { items: [{ productType: 'honey'|'ghee', productName, quantity, pricePerKg }] }
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const rawItems = body && typeof body === 'object' ? body.items : undefined
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > MAX_ITEMS) {
    throw createError({ statusCode: 400, statusMessage: 'أضف صنفاً واحداً على الأقل' })
  }

  const items = rawItems.map((raw, index) => {
    const quantity = Number(raw?.quantity)
    const pricePerKg = Number(raw?.pricePerKg)
    const productName = typeof raw?.productName === 'string' ? raw.productName.trim() : ''
    if (!isProductType(raw?.productType) || !productName ||
        !Number.isFinite(quantity) || quantity <= 0 ||
        !Number.isFinite(pricePerKg) || pricePerKg <= 0) {
      throw createError({ statusCode: 400, statusMessage: `بيانات الصنف رقم ${index + 1} غير صحيحة` })
    }
    // الإجماليات تُحسب في الخادم دائماً
    return { productType: raw.productType, productName, quantity, pricePerKg, lineTotal: round2(quantity * pricePerKg) }
  })

  const total = round2(items.reduce((s, i) => s + i.lineTotal, 0))

  // neon-http لا يدعم المعاملات التفاعلية، لذا نحجز رقم الفاتورة أولاً
  // ثم ننفذ إدراج الفاتورة وأصنافها في batch واحد (يُنفَّذ كمعاملة واحدة: كل شيء أو لا شيء)
  const { rows } = await db.execute<{ id: number }>(
    sql`select nextval(pg_get_serial_sequence('invoices', 'id'))::int as id`,
  )
  const id = Number(rows[0]?.id)
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 500, statusMessage: 'فشل إنشاء الفاتورة' })
  }

  await db.batch([
    db.insert(invoices).values({ id, total: total.toString() }),
    db.insert(invoiceItems).values(items.map(i => ({
      invoiceId: id,
      productType: i.productType,
      productName: i.productName,
      quantity: i.quantity.toString(),
      pricePerKg: i.pricePerKg.toString(),
      lineTotal: i.lineTotal.toString(),
    }))),
  ])

  const invoice = await getInvoice(id)
  return { success: true, invoice: invoice ? toInvoiceDto(invoice) : { id } }
})
