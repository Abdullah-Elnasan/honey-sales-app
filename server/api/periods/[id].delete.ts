import { db } from '../../utils/db'
import { periods } from '../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 400, message: 'معرّف الفترة غير صالح' })
  }

  const [deletedPeriod] = await db.delete(periods)
    .where(eq(periods.id, id))
    .returning({ id: periods.id })

  if (!deletedPeriod) {
    throw createError({ statusCode: 404, message: 'الفترة غير موجودة' })
  }

  return { success: true }
})
