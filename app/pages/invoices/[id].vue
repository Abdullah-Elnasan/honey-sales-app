<template>
  <div>
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div>
        <NuxtLink to="/invoices" class="back-link text-sm">→ فواتير الموردين</NuxtLink>
        <h1 class="mt-1">فاتورة #{{ route.params.id }}</h1>
        <p v-if="invoice" class="text-muted mt-1">{{ formatDate(invoice.createdAt) }}</p>
      </div>
      <button v-if="invoice" class="btn btn-primary btn-lg" :disabled="invoice.remaining <= 0" @click="openModal">＋ إضافة دفعة</button>
    </div>

    <div v-if="loading" class="card empty-state"><p>جارٍ التحميل...</p></div>
    <div v-else-if="!invoice" class="card empty-state"><div class="empty-icon">🧾</div><p>الفاتورة غير موجودة.</p></div>
    <template v-else>
      <div class="card mb-4 animate-fade">
        <div class="card-header">
          <h2>بيانات الفاتورة</h2>
          <div class="flex gap-2">
            <span v-for="t in invoice.productTypes" :key="t" class="badge" :class="typeBadge(t)">{{ typeLabel(t) }}</span>
          </div>
        </div>
        <div class="info-grid">
          <div><span class="stat-label">عدد الأصناف</span><span class="info-value">{{ invoice.itemsCount }}</span></div>
          <div><span class="stat-label">إجمالي الكمية</span><span class="info-value">{{ invoice.totalQuantity.toFixed(1) }} كغ</span></div>
          <div><span class="stat-label">إجمالي الفاتورة</span><span class="info-value">{{ invoice.total.toFixed(2) }}</span></div>
          <div><span class="stat-label">إجمالي المدفوع</span><span class="info-value text-success">{{ invoice.totalPaid.toFixed(2) }}</span></div>
          <div><span class="stat-label">المتبقي</span><span class="info-value" :class="invoice.remaining > 0 ? 'text-danger' : 'text-success'">{{ invoice.remaining.toFixed(2) }}</span></div>
        </div>
        <div class="progress mt-3"><div class="progress-fill" :style="{ width: paidPct + '%' }"></div></div>
        <span class="text-sm text-muted">{{ paidPct.toFixed(0) }}% مدفوع</span>
      </div>

      <h2 class="mb-3">أصناف الفاتورة</h2>
      <div class="table-container mb-4">
        <table class="table">
          <thead><tr><th>#</th><th>النوع</th><th>اسم الصنف</th><th>الكمية (كغ)</th><th>سعر الكيلو</th><th>الإجمالي</th></tr></thead>
          <tbody>
            <tr v-for="(item, i) in invoice.items" :key="item.id">
              <td class="text-muted">{{ i + 1 }}</td>
              <td><span class="badge" :class="typeBadge(item.productType)">{{ typeLabel(item.productType) }}</span></td>
              <td class="font-semibold">{{ item.productName }}</td>
              <td>{{ item.quantity.toFixed(1) }}</td>
              <td>{{ item.pricePerKg.toFixed(2) }}</td>
              <td class="font-semibold">{{ item.lineTotal.toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot><tr><td colspan="3">الإجمالي ({{ invoice.itemsCount }})</td><td>{{ invoice.totalQuantity.toFixed(1) }} كغ</td><td>—</td><td class="text-success">{{ invoice.total.toFixed(2) }}</td></tr></tfoot>
        </table>
      </div>

      <h2 class="mb-3">الدفعات</h2>
      <div v-if="invoice.payments.length === 0" class="card empty-state"><div class="empty-icon">💰</div><p>لا توجد دفعات بعد.</p></div>
      <div v-else class="table-container">
        <table class="table">
          <thead><tr><th>مبلغ الدفعة</th><th>اسم الدافع</th><th>التاريخ</th></tr></thead>
          <tbody>
            <tr v-for="p in invoice.payments" :key="p.id">
              <td class="font-semibold">{{ p.amount.toFixed(2) }}</td>
              <td>{{ p.payerName }}</td>
              <td class="text-sm">{{ formatDate(p.date) }}</td>
            </tr>
          </tbody>
          <tfoot><tr><td class="text-success">{{ invoice.totalPaid.toFixed(2) }}</td><td colspan="2">الإجمالي ({{ invoice.payments.length }})</td></tr></tfoot>
        </table>
      </div>
    </template>

    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal card animate-fade" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
          <div class="card-header"><h2 id="payment-modal-title">إضافة دفعة</h2><button class="btn btn-ghost" @click="closeModal">✕</button></div>
          <div class="form-group">
            <label class="form-label required">مبلغ الدفعة</label>
            <input v-model.number="payment.amount" type="number" min="0" step="0.01" class="input" />
            <span class="text-sm text-muted">المتبقي: {{ invoice?.remaining.toFixed(2) }}</span>
            <span v-if="overpay" class="text-danger text-sm">المبلغ أكبر من المتبقي</span>
          </div>
          <div class="form-group">
            <label class="form-label required">اسم الدافع</label>
            <input v-model="payment.payerName" class="input" placeholder="اسم الدافع" />
          </div>
          <div class="form-group">
            <label class="form-label required">التاريخ</label>
            <input v-model="payment.date" type="date" class="input" />
          </div>
          <div class="flex gap-2 mt-2">
            <button class="btn btn-primary" :disabled="!paymentValid || saving" @click="savePayment">{{ saving ? 'جارٍ الحفظ...' : 'حفظ الدفعة' }}</button>
            <button class="btn btn-secondary" :disabled="saving" @click="closeModal">إلغاء</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const route = useRoute()
const { notify } = useNotify()
const { typeLabel, typeBadge } = useProductTypes()
const invoice = ref(null)
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const today = () => new Date().toISOString().slice(0, 10)
const payment = reactive({ amount: 0, payerName: '', date: today() })

const paidPct = computed(() => !invoice.value || invoice.value.total <= 0 ? 0 : Math.min(100, (invoice.value.totalPaid / invoice.value.total) * 100))
const overpay = computed(() => invoice.value && payment.amount > invoice.value.remaining + 0.001)
const paymentValid = computed(() => payment.amount > 0 && payment.payerName.trim() && payment.date && !overpay.value)

async function fetchInvoice() {
  try {
    invoice.value = await $fetch(`/api/invoices/${route.params.id}`)
  } catch (e) {
    invoice.value = null
    if (e.statusCode !== 404) notify(e.data?.statusMessage || 'تعذر تحميل الفاتورة', 'error')
  } finally {
    loading.value = false
  }
}
function openModal() {
  Object.assign(payment, { amount: invoice.value?.remaining ?? 0, payerName: '', date: today() })
  showModal.value = true
}
function closeModal() { if (!saving.value) showModal.value = false }
async function savePayment() {
  saving.value = true
  try {
    await $fetch(`/api/invoices/${route.params.id}/payments`, { method: 'POST', body: payment })
    notify('تمت إضافة الدفعة')
    showModal.value = false
    await fetchInvoice()
  } catch (e) {
    notify(e.data?.statusMessage || 'فشل إضافة الدفعة', 'error')
  } finally {
    saving.value = false
  }
}
const onKey = e => { if (e.key === 'Escape') closeModal() }
const formatDate = d => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
onMounted(() => { fetchInvoice(); window.addEventListener('keydown', onKey) })
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.back-link { color: var(--text-muted); text-decoration: none; }
.back-link:hover { color: var(--primary); }
.info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; }
.info-grid > div { display: flex; flex-direction: column; gap: .25rem; }
.stat-label { font-size: .8rem; color: var(--text-muted); font-weight: 500; }
.info-value { font-size: 1.25rem; font-weight: 700; font-family: 'Cairo', sans-serif; }
.progress { height: 8px; background: var(--ink-100); border-radius: 999px; overflow: hidden; margin-bottom: .35rem; }
.progress-fill { height: 100%; background: var(--primary); border-radius: 999px; transition: width .3s; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(27, 24, 18, 0.45); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 100; }
.modal { width: 100%; max-width: 440px; box-shadow: var(--shadow-lg); }
</style>
