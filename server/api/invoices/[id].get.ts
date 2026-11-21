import { getInvoice, parseInvoiceId, toInvoiceDto } from '../../utils/invoices'

// GET /api/invoices/:id — الفاتورة مع الأصناف والدفعات وملخص الدفع
export default defineEventHandler(async (event) => {
  const id = parseInvoiceId(getRouterParam(event, 'id'))

  const invoice = await getInvoice(id)
  if (!invoice) {
    throw createError({ statusCode: 404, statusMessage: 'الفاتورة غير موجودة' })
  }

  return {
    ...toInvoiceDto(invoice),
    payments: invoice.payments.map(p => ({ ...p, amount: Number(p.amount) })),
  }
})
