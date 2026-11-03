import { db } from '../../utils/db'
import { periods, periodStock, honeyTypes } from '../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    throw createError({ statusCode: 400, message: 'اسم الفترة مطلوب' })
  }
  // body: { name, startDate, stock: [{ typeName, quantityKg, costPerKg }] }
  
  const [period] = await db.insert(periods).values({
    name,
    startDate: new Date(body.startDate),
  }).returning()

  if (!period) {
    throw createError({ statusCode: 500, message: 'فشل إنشاء الفترة' })
  }

  for (const item of body.stock) {
    // إدراج النوع إذا لم يكن موجوداً
    const [type] = await db.insert(honeyTypes)
      .values({ name: item.typeName })
      .onConflictDoNothing()
      .returning()
    
    let typeId: number
    if (type) {
      typeId = type.id
    } else {
      // النوع موجود مسبقاً، لذا نجلبه
      const existing = await db.select().from(honeyTypes).where(eq(honeyTypes.name, item.typeName))
      const existingType = existing[0]
      if (!existingType) {
        throw createError({ statusCode: 500, message: `فشل العثور على النوع: ${item.typeName}` })
      }
      typeId = existingType.id
    }

    await db.insert(periodStock).values({
      periodId: period.id,
      honeyTypeId: typeId,
      quantityKg: item.quantityKg.toString(),
      costPerKg: item.costPerKg.toString(),
    })
  }

  return { success: true, periodId: period.id }
})