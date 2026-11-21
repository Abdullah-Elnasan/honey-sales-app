import { db } from '../../utils/db'
import { invoices } from '../../utils/schema'
import { isProductType, round2 } from '../../utils/invoices'

// POST /api/invoices  body: { type, quantity, pricePerKg }
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'بيانات الفاتورة غير صحيحة' })
  }

  const quantity = Number(body.quantity)
  const pricePerKg = Number(body.pricePerKg)

  if (!isProductType(body.type) ||
      !Number.isFinite(quantity) || quantity <= 0 ||
      !Number.isFinite(pricePerKg) || pricePerKg <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'بيانات الفاتورة غير صحيحة' })
  }

  // الإجمالي يُحسب في الخادم دائماً
  const total = round2(quantity * pricePerKg)

  const [invoice] = await db.insert(invoices).values({
    type: body.type,
    quantity: quantity.toString(),
    pricePerKg: pricePerKg.toString(),
    total: total.toString(),
  }).returning()

  return { success: true, invoice }
})
