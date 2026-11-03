<template>
  <div>
    <div class="mb-4"><h1>سجل المبيعات</h1><p class="text-muted mt-1">جميع العمليات مع الفلترة</p></div>
    <div class="card mb-4">
      <div class="filters">
        <div class="form-group"><label class="form-label">الفترة</label><select v-model="filters.periodId" class="select" @change="fetchSales"><option value="">الكل</option><option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }} — {{ formatDate(p.startDate) }}</option></select></div>
        <div class="form-group"><label class="form-label">النوع</label><select v-model="filters.typeId" class="select" @change="fetchSales"><option value="">الكل</option><option v-for="t in types" :key="t.id" :value="t.id">{{ t.name }}</option></select></div>
        <div class="form-group"><label class="form-label">البائع</label><select v-model="filters.seller" class="select" @change="fetchSales"><option value="">الكل</option><option v-for="s in sellers" :key="s" :value="s">{{ s }}</option></select></div>
        <div class="form-group"><label class="form-label">من</label><input v-model="filters.from" type="date" class="input" @change="fetchSales" /></div>
        <div class="form-group"><label class="form-label">إلى</label><input v-model="filters.to" type="date" class="input" @change="fetchSales" /></div>
        <div class="form-group"><label class="form-label">&nbsp;</label><button class="btn btn-secondary" @click="resetFilters">مسح</button></div>
      </div>
    </div>
    <div v-if="sales.length === 0" class="card empty-state"><div class="empty-icon">📋</div><p>لا توجد مبيعات مطابقة.</p></div>
    <div v-else class="table-container">
      <table class="table">
        <thead><tr><th>التاريخ</th><th>النوع</th><th>الكمية (كغ)</th><th>سعر الكيلو</th><th>الإجمالي</th><th>البائع</th></tr></thead>
        <tbody><tr v-for="s in sales" :key="s.id"><td class="text-sm">{{ formatDateTime(s.saleDate) }}</td><td>{{ s.typeName }}</td><td>{{ Number(s.quantityKg).toFixed(1) }}</td><td>{{ Number(s.pricePerKg).toFixed(2) }}</td><td class="font-semibold">{{ Number(s.totalPrice).toFixed(2) }}</td><td>{{ s.sellerName }}</td></tr></tbody>
        <tfoot><tr><td colspan="2">الإجمالي ({{ sales.length }})</td><td>{{ totalQty.toFixed(1) }} كغ</td><td>—</td><td class="text-success">{{ totalRevenue.toFixed(2) }}</td><td></td></tr></tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
const sales = ref([])
const periods = ref([])
const types = ref([])
const sellers = ref([])
const filters = reactive({ periodId: '', typeId: '', seller: '', from: '', to: '' })
const totalQty = computed(() => sales.value.reduce((s, x) => s + Number(x.quantityKg), 0))
const totalRevenue = computed(() => sales.value.reduce((s, x) => s + Number(x.totalPrice), 0))

async function fetchSales() {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
  sales.value = await $fetch(`/api/sales?${params}`)
}
function resetFilters() { Object.keys(filters).forEach(k => filters[k] = ''); fetchSales() }
const formatDate = d => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
const formatDateTime = d => new Date(d).toLocaleString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

onMounted(async () => {
  const [p, t, s] = await Promise.all([$fetch('/api/periods'), $fetch('/api/types'), $fetch('/api/sellers')])
  periods.value = p; types.value = t; sellers.value = s;
  await fetchSales()
})
</script>

<style scoped>
.filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .75rem; align-items: end; }
</style>