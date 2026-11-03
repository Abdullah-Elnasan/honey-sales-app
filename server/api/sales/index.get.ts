import { db } from '../../utils/db'
import { sales, honeyTypes, periods } from '../../utils/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const conds = []
  if (q.periodId) conds.push(eq(sales.periodId, Number(q.periodId)))
  if (q.typeId) conds.push(eq(sales.honeyTypeId, Number(q.typeId)))
  if (q.seller) conds.push(eq(sales.sellerName, q.seller as string))
  if (q.from) conds.push(gte(sales.saleDate, new Date(q.from as string)))
  if (q.to) conds.push(lte(sales.saleDate, new Date(q.to as string)))

  return db.select({
    id: sales.id,
    typeName: honeyTypes.name,
    quantityKg: sales.quantityKg,
    pricePerKg: sales.pricePerKg,
    totalPrice: sales.totalPrice,
    sellerName: sales.sellerName,
    saleDate: sales.saleDate,
    periodId: sales.periodId,
  })
  .from(sales)
  .leftJoin(honeyTypes, eq(sales.honeyTypeId, honeyTypes.id))
  .where(conds.length ? and(...conds) : undefined)
  .orderBy(desc(sales.saleDate))
})