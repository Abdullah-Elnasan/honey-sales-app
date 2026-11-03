import { db } from '../../utils/db'
import { periods, periodStock } from '../../utils/schema'
import { desc, count, sum } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const list = await db.select().from(periods).orderBy(desc(periods.startDate))
  const summaries = await db.select({
    periodId: periodStock.periodId,
    typesCount: count(periodStock.id),
    totalQty: sum(periodStock.quantityKg),
  }).from(periodStock).groupBy(periodStock.periodId)

  const map = new Map(summaries.map(s => [s.periodId, s]))
  return list.map(p => ({
    ...p,
    typesCount: Number(map.get(p.id)?.typesCount ?? 0),
    totalQty: Number(map.get(p.id)?.totalQty ?? 0),
  }))
})