import { db } from '../../../utils/db'
import { payments } from '../../../utils/schema'
import { getInvoiceBalance, parseInvoiceId, round2 } from '../../../utils/invoices'

// POST /api/invoices/:id/payments  body: { amount, payerName, date: 'YYYY-MM-DD' }
export default defineEventHandler(async (event) => {
  const invoiceId = parseInvoiceId(getRouterParam(event, 'id'))
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'بيانات الدفعة غير صحيحة' })
  }

  const amount = round2(Number(body.amount))
  const payerName = typeof body.payerName === 'string' ? body.payerName.trim() : ''
  const date = typeof body.date === 'string' ? body.date : ''
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(date).getTime())

  if (!Number.isFinite(amount) || amount <= 0 || !payerName || !validDate) {
    throw createError({ statusCode: 400, statusMessage: 'بيانات الدفعة غير صحيحة' })
  }

  const balance = await getInvoiceBalance(invoiceId)
  if (!balance) {
    throw createError({ statusCode: 404, statusMessage: 'الفاتورة غير موجودة' })
  }

  const { remaining } = balance
  if (amount > remaining + 0.001) {
    throw createError({ statusCode: 400, statusMessage: `المبلغ أكبر من المتبقي (${remaining.toFixed(2)})` })
  }

  const [payment] = await db.insert(payments).values({
    invoiceId,
    amount: amount.toString(),
    payerName,
    date,
  }).returning()

  return { success: true, payment }
})
