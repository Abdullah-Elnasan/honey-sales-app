import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { sales } from '../../utils/schema'
import { ensureAvailableStock } from '../../utils/sales'

export default defineEventHandler(async (event) => {
  const saleId = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(saleId) || saleId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'رقم السجل غير صحيح' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'بيانات البيع غير صحيحة' })
  }

  const periodId = Number(body.periodId)
  const honeyTypeId = Number(body.honeyTypeId)
  const quantityKg = Number(body.quantityKg)
  const pricePerKg = Number(body.pricePerKg)
  const sellerName = typeof body.sellerName === 'string' ? body.sellerName.trim() : ''
  const buyerName = typeof body.buyerName === 'string' ? body.buyerName.trim() : ''

  if (!Number.isInteger(periodId) || periodId <= 0 ||
      !Number.isInteger(honeyTypeId) || honeyTypeId <= 0 ||
      !Number.isFinite(quantityKg) || quantityKg <= 0 ||
      !Number.isFinite(pricePerKg) || pricePerKg <= 0 ||
      !sellerName || !buyerName || typeof body.paymentReceived !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'بيانات البيع غير صحيحة' })
  }

  const [existingSale] = await db.select({ id: sales.id })
    .from(sales)
    .where(eq(sales.id, saleId))
  if (!existingSale) {
    throw createError({ statusCode: 404, statusMessage: 'سجل البيع غير موجود' })
  }

  await ensureAvailableStock(periodId, honeyTypeId, quantityKg, saleId)
  const [sale] = await db.update(sales).set({
    periodId,
    honeyTypeId,
    quantityKg: quantityKg.toString(),
    pricePerKg: pricePerKg.toString(),
    totalPrice: (quantityKg * pricePerKg).toString(),
    sellerName,
    buyerName,
    paymentReceived: body.paymentReceived,
  }).where(eq(sales.id, saleId)).returning()

  return { success: true, sale }
})
