import { db } from '../../utils/db'
import { periodStock, sales, honeyTypes } from '../../utils/schema'
import { PRODUCT_TYPES } from '../../utils/invoices'
import { eq, sum } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const periodId = Number(getRouterParam(event, 'periodId'))

  // جلب المخزون الأولي لكل نوع
  const stock = await db.select({
    typeId: periodStock.honeyTypeId,
    typeName: honeyTypes.name,
    category: honeyTypes.category,
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
    const totalRevenue = Number(soldItem?.totalRevenue ?? 0)
    const costPerKg = Number(item.costPerKg)
    const totalCost = totalSold * costPerKg
    return {
      typeName: item.typeName,
      category: item.category ?? 'honey',
      initialQty: Number(item.initialQty),
      totalSold,
      remaining,
      totalRevenue,
      costPerKg,
      totalCost,
      profit: totalRevenue - totalCost,
    }
  })

  const summarize = (rows: typeof details) => {
    const totalRevenue = rows.reduce((s, d) => s + d.totalRevenue, 0)
    const totalCost = rows.reduce((s, d) => s + d.totalCost, 0)
    return { totalRevenue, totalCost, profit: totalRevenue - totalCost }
  }

  // ملخص منفصل لكل نوع منتج (عسل / سمن)
  const byCategory = Object.fromEntries(
    PRODUCT_TYPES.map(c => [c, summarize(details.filter(d => d.category === c))]),
  ) as Record<typeof PRODUCT_TYPES[number], ReturnType<typeof summarize>>

  return { details, ...summarize(details), byCategory }
})
