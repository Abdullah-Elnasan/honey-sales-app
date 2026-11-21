import { db } from '../../utils/db'
import { periods, periodStock, honeyTypes } from '../../utils/schema'
import { isProductType } from '../../utils/invoices'

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
    // إدراج النوع إذا لم يكن موجوداً، وتحديث تصنيفه (عسل/سمن) إذا وُجد
    const category = isProductType(item.category) ? item.category : 'honey'
    const [type] = await db.insert(honeyTypes)
      .values({ name: item.typeName, category })
      .onConflictDoUpdate({ target: honeyTypes.name, set: { category } })
      .returning()

    if (!type) {
      throw createError({ statusCode: 500, message: `فشل العثور على النوع: ${item.typeName}` })
    }
    const typeId = type.id

    await db.insert(periodStock).values({
      periodId: period.id,
      honeyTypeId: typeId,
      quantityKg: item.quantityKg.toString(),
      costPerKg: item.costPerKg.toString(),
    })
  }

  return { success: true, periodId: period.id }
})