import { asc, eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { invoices, payments } from '../../utils/schema'
import { invoiceSummaryQuery, parseInvoiceId, toInvoiceSummary } from '../../utils/invoices'

// GET /api/invoices/:id — الفاتورة مع ملخص الدفع وقائمة الدفعات
export default defineEventHandler(async (event) => {
  const id = parseInvoiceId(getRouterParam(event, 'id'))

  const [row] = await invoiceSummaryQuery().where(eq(invoices.id, id))
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'الفاتورة غير موجودة' })
  }

  const list = await db.select().from(payments)
    .where(eq(payments.invoiceId, id))
    .orderBy(asc(payments.date), asc(payments.id))

  return {
    ...toInvoiceSummary(row),
    payments: list.map(p => ({ ...p, amount: Number(p.amount) })),
  }
})
