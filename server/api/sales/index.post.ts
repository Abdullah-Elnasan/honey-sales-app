import { db } from '../../utils/db'
import { sales } from '../../utils/schema'
import { ensureAvailableStock } from '../../utils/sales'

export default defineEventHandler(async (event) => {
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

  await ensureAvailableStock(periodId, honeyTypeId, quantityKg)
  const totalPrice = quantityKg * pricePerKg

  const [sale] = await db.insert(sales).values({
    periodId,
    honeyTypeId,
    quantityKg: quantityKg.toString(),
    pricePerKg: pricePerKg.toString(),
    totalPrice: totalPrice.toString(),
    sellerName,
    buyerName,
    paymentReceived: body.paymentReceived,
  }).returning()

  return { success: true, sale }
})