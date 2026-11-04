import { and, eq, ne } from 'drizzle-orm'
import { db } from './db'
import { periodStock, sales } from './schema'

export async function ensureAvailableStock(
  periodId: number,
  honeyTypeId: number,
  quantityKg: number,
  excludeSaleId?: number,
) {
  const [stock] = await db.select({
    quantityKg: periodStock.quantityKg,
  }).from(periodStock).where(and(
    eq(periodStock.periodId, periodId),
    eq(periodStock.honeyTypeId, honeyTypeId),
  ))

  if (!stock) {
    throw createError({ statusCode: 400, statusMessage: 'نوع العسل غير متوفر في هذه الفترة' })
  }

  const conditions = [
    eq(sales.periodId, periodId),
    eq(sales.honeyTypeId, honeyTypeId),
  ]
  if (excludeSaleId !== undefined) conditions.push(ne(sales.id, excludeSaleId))

  const existingSales = await db.select({
    quantityKg: sales.quantityKg,
  }).from(sales).where(and(...conditions))
  const soldQuantity = existingSales.reduce((total, sale) => total + Number(sale.quantityKg), 0)
  const availableQuantity = Number(stock.quantityKg) - soldQuantity

  if (quantityKg > availableQuantity) {
    throw createError({ statusCode: 400, statusMessage: 'الكمية المطلوبة أكبر من المخزون المتاح' })
  }
}
