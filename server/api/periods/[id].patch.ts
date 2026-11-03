import { db } from '../../utils/db'
import { periods } from '../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await db.update(periods)
    .set({ endDate: new Date() })
    .where(eq(periods.id, id))
  return { success: true }
})