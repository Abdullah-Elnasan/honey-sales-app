<template>
  <div>
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div>
        <h1>فواتير الموردين</h1>
        <p class="text-muted mt-1">سجل الفواتير والدفعات</p>
      </div>
      <NuxtLink to="/invoices/new" class="btn btn-primary btn-lg">＋ فاتورة جديدة</NuxtLink>
    </div>

    <div class="card mb-4">
      <div class="filters">
        <div class="form-group">
          <label class="form-label">النوع</label>
          <select v-model="typeFilter" class="select" @change="onFilterChange">
            <option value="">الكل</option>
            <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid summary-grid gap-3 mb-4">
      <div class="stat-card"><span class="stat-label">إجمالي الفواتير</span><span class="stat-value">{{ sumTotal.toFixed(2) }}</span></div>
      <div class="stat-card"><span class="stat-label">إجمالي المدفوع</span><span class="stat-value text-success">{{ sumPaid.toFixed(2) }}</span></div>
      <div class="stat-card"><span class="stat-label">المتبقي</span><span class="stat-value" :class="sumRemaining > 0 ? 'text-danger' : 'text-success'">{{ sumRemaining.toFixed(2) }}</span></div>
    </div>

    <div v-if="loading" class="card empty-state"><p>جارٍ التحميل...</p></div>
    <div v-else-if="invoices.length === 0" class="card empty-state"><div class="empty-icon">🧾</div><p>لا توجد فواتير مطابقة.</p></div>
    <div v-else class="table-container">
      <table class="table">
        <thead><tr><th>#</th><th>التاريخ</th><th>الأصناف</th><th>الكمية (كغ)</th><th>إجمالي الفاتورة</th><th>المدفوع</th><th>المتبقي</th><th>إجراءات</th></tr></thead>
        <tbody>
          <tr v-for="inv in invoices" :key="inv.id">
            <td class="text-muted">{{ inv.id }}</td>
            <td class="text-sm">{{ formatDate(inv.createdAt) }}</td>
            <td>
              <div class="items-summary">
                <span class="font-semibold">{{ inv.itemsCount }} {{ inv.itemsCount === 1 ? 'صنف' : 'أصناف' }}</span>
                <span v-for="t in inv.productTypes" :key="t" class="badge" :class="typeBadge(t)">{{ typeLabel(t) }}</span>
              </div>
              <div class="text-sm text-muted items-names" :title="itemNames(inv)">{{ itemNames(inv) }}</div>
            </td>
            <td>{{ inv.totalQuantity.toFixed(1) }}</td>
            <td class="font-semibold">{{ inv.total.toFixed(2) }}</td>
            <td class="text-success">{{ inv.totalPaid.toFixed(2) }}</td>
            <td><span class="badge" :class="inv.remaining > 0 ? 'badge-danger' : 'badge-success'">{{ inv.remaining > 0 ? inv.remaining.toFixed(2) : 'مسددة' }}</span></td>
            <td><NuxtLink :to="`/invoices/${inv.id}`" class="btn btn-secondary">التفاصيل</NuxtLink></td>
          </tr>
        </tbody>
        <tfoot><tr><td colspan="3">الإجمالي ({{ invoices.length }})</td><td>{{ sumQty.toFixed(1) }} كغ</td><td>{{ sumTotal.toFixed(2) }}</td><td class="text-success">{{ sumPaid.toFixed(2) }}</td><td>{{ sumRemaining.toFixed(2) }}</td><td></td></tr></tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { notify } = useNotify()
const { options, typeLabel, typeBadge } = useProductTypes()
const invoices = ref([])
const loading = ref(true)
const typeFilter = ref(typeof route.query.type === 'string' ? route.query.type : '')

const sum = key => invoices.value.reduce((s, x) => s + x[key], 0)
const sumQty = computed(() => sum('totalQuantity'))
const itemNames = inv => inv.items.map(i => i.productName).join('، ')
const sumTotal = computed(() => sum('total'))
const sumPaid = computed(() => sum('totalPaid'))
const sumRemaining = computed(() => sum('remaining'))

async function fetchInvoices() {
  loading.value = true
  try {
    invoices.value = await $fetch('/api/invoices', { query: typeFilter.value ? { type: typeFilter.value } : {} })
  } catch (e) {
    notify(e.data?.statusMessage || 'تعذر تحميل الفواتير', 'error')
  } finally {
    loading.value = false
  }
}
function onFilterChange() {
  router.replace({ query: typeFilter.value ? { type: typeFilter.value } : {} })
  fetchInvoices()
}
const formatDate = d => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
onMounted(fetchInvoices)
</script>

<style scoped>
.filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 220px)); gap: .75rem; align-items: end; }
.filters .form-group { margin-bottom: 0; }
.summary-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.stat-card { display: flex; flex-direction: column; gap: .35rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); }
.stat-label { font-size: .8rem; color: var(--text-muted); font-weight: 500; }
.stat-value { font-size: 1.5rem; font-weight: 700; font-family: 'Cairo', sans-serif; }
a.btn { text-decoration: none; }
.items-summary { display: flex; align-items: center; gap: .35rem; flex-wrap: wrap; }
.items-names { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: .2rem; }
</style>
