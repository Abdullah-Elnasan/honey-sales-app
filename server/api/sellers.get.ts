import { db } from '../utils/db'
import { sales } from '../utils/schema'

export default defineEventHandler(async () => {
  const result = await db.selectDistinct({ sellerName: sales.sellerName }).from(sales)
  return result.map(r => r.sellerName)
})