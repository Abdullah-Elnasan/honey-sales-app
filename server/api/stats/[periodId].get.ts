import { db } from '../../utils/db'
import { periodStock, sales, honeyTypes } from '../../utils/schema'
import { eq, sum, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const periodId = Number(getRouterParam(event, 'periodId'))

  // جلب المخزون الأولي لكل نوع
  const stock = await db.select({
    typeId: periodStock.honeyTypeId,
    typeName: honeyTypes.name,
    initialQty: periodStock.quantityKg,
    costPerKg: periodStock.costPerKg,
  })
  .from(periodStock)
  .leftJoin(honeyTypes, eq(periodStock.honeyTypeId, honeyTypes.id))
  .where(eq(periodStock.periodId, periodId))

  // جلب إجمالي المبيعات لكل نوع
  const sold = await db.select({
    typeId: sales.honeyTypeId,
    totalSold: sum(sales.quantityKg).as('total_sold'),
    totalRevenue: sum(sales.totalPrice).as('total_revenue'),
  })
  .from(sales)
  .where(eq(sales.periodId, periodId))
  .groupBy(sales.honeyTypeId)

  const soldMap = new Map(sold.map(s => [s.typeId, s]))

  const details = stock.map(item => {
    const soldItem = soldMap.get(item.typeId)
    const totalSold = Number(soldItem?.totalSold ?? 0)
    const remaining = Number(item.initialQty) - totalSold
    return {
      typeName: item.typeName,
      initialQty: Number(item.initialQty),
      totalSold,
      remaining,
      totalRevenue: Number(soldItem?.totalRevenue ?? 0),
      costPerKg: Number(item.costPerKg),
    }
  })

  const totalRevenue = details.reduce((s, d) => s + d.totalRevenue, 0)
  const totalCost = details.reduce((s, d) => s + (d.totalSold * d.costPerKg), 0)

  return { details, totalRevenue, totalCost, profit: totalRevenue - totalCost }
})