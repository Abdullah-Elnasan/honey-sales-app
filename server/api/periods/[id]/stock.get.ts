import { db } from '../../../utils/db'
import { periodStock, honeyTypes, sales } from '../../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const periodId = Number(getRouterParam(event, 'id'))

  const stock = await db.select({
    typeId: periodStock.honeyTypeId,
    typeName: honeyTypes.name,
    initialQty: periodStock.quantityKg,
    costPerKg: periodStock.costPerKg,
  })
  .from(periodStock)
  .leftJoin(honeyTypes, eq(periodStock.honeyTypeId, honeyTypes.id))
  .where(eq(periodStock.periodId, periodId))

  const sold = await db.select({
    typeId: sales.honeyTypeId,
    qty: sales.quantityKg,
  }).from(sales).where(eq(sales.periodId, periodId))

  const soldMap = new Map<number, number>()
  for (const s of sold) {
    soldMap.set(s.typeId, (soldMap.get(s.typeId) ?? 0) + Number(s.qty))
  }

  return stock.map(item => {
    const soldQty = soldMap.get(item.typeId) ?? 0
    return {
      typeId: item.typeId,
      typeName: item.typeName,
      initialQty: Number(item.initialQty),
      costPerKg: Number(item.costPerKg),
      soldQty,
      remaining: Number(item.initialQty) - soldQty,
    }
  })
})