import { db } from '../../utils/db'
import { sales } from '../../utils/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // body: { periodId, honeyTypeId, quantityKg, pricePerKg, sellerName }
  
  const totalPrice = body.quantityKg * body.pricePerKg
  
  const [sale] = await db.insert(sales).values({
    periodId: body.periodId,
    honeyTypeId: body.honeyTypeId,
    quantityKg: body.quantityKg.toString(),
    pricePerKg: body.pricePerKg.toString(),
    totalPrice: totalPrice.toString(),
    sellerName: body.sellerName,
  }).returning()

  return { success: true, sale }
})