import { db } from '../../utils/db'
import { honeyTypes } from '../../utils/schema'

export default defineEventHandler(async () => {
  return db.select().from(honeyTypes)
})