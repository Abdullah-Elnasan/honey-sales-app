import { isProductType, listInvoices, toInvoiceDto } from '../../utils/invoices'

// GET /api/invoices?type=honey|ghee — الفواتير التي تحتوي صنفاً من النوع المطلوب، مع الأصناف المتداخلة
export default defineEventHandler(async (event) => {
  const { type } = getQuery(event)
  if (type !== undefined && type !== '' && !isProductType(type)) {
    throw createError({ statusCode: 400, statusMessage: 'نوع المنتج غير صحيح' })
  }

  const rows = await listInvoices(isProductType(type) ? type : undefined)
  return rows.map(toInvoiceDto)
})
