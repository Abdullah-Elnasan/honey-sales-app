import { desc, eq } from 'drizzle-orm'
import { invoices } from '../../utils/schema'
import { invoiceSummaryQuery, isProductType, toInvoiceSummary } from '../../utils/invoices'

// GET /api/invoices?type=honey|ghee
export default defineEventHandler(async (event) => {
  const { type } = getQuery(event)
  if (type !== undefined && type !== '' && !isProductType(type)) {
    throw createError({ statusCode: 400, statusMessage: 'نوع المنتج غير صحيح' })
  }

  let query = invoiceSummaryQuery()
  if (isProductType(type)) query = query.where(eq(invoices.type, type))

  const rows = await query.orderBy(desc(invoices.createdAt), desc(invoices.id))
  return rows.map(toInvoiceSummary)
})
