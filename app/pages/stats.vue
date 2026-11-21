<template>
  <div>
    <div class="mb-4"><h1>الإحصائيات</h1><p class="text-muted mt-1">تحليل أداء الفترة</p></div>
    <div class="form-group mb-4" style="max-width: 340px;">
      <label class="form-label">اختر الفترة</label>
      <select v-model="selectedPeriod" class="select" @change="loadStats">
        <option value="" disabled>اختر فترة</option>
        <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }} — {{ formatDate(p.startDate) }} {{ p.endDate ? '(منتهية)' : '(نشطة)' }}</option>
      </select>
    </div>
    <div v-if="stats" class="animate-fade">
      <div class="type-tabs mb-4" role="tablist">
        <button v-for="t in tabs" :key="t.value" role="tab" :aria-selected="activeTab === t.value" class="type-tab" :class="{ 'type-tab--active': activeTab === t.value }" @click="activeTab = t.value">{{ t.label }}</button>
      </div>
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="stat-card"><span class="stat-label">إجمالي الإيرادات</span><span class="stat-value text-success">{{ summary.totalRevenue.toFixed(2) }}</span></div>
        <div class="stat-card"><span class="stat-label">إجمالي التكلفة</span><span class="stat-value">{{ summary.totalCost.toFixed(2) }}</span></div>
        <div class="stat-card"><span class="stat-label">صافي الربح</span><span class="stat-value" :class="summary.profit >= 0 ? 'text-success' : 'text-danger'">{{ summary.profit.toFixed(2) }}</span></div>
      </div>
      <div v-if="visibleDetails.length === 0" class="card empty-state"><p>لا توجد أصناف من هذا النوع في الفترة.</p></div>
      <div v-else class="table-container">
        <table class="table">
          <thead><tr><th>النوع</th><th>التصنيف</th><th>أولية (كغ)</th><th>مباع (كغ)</th><th>متبقي (كغ)</th><th style="min-width: 120px;">نسبة البيع</th><th>الإيراد</th><th>التكلفة</th><th>الربح</th></tr></thead>
          <tbody>
            <tr v-for="d in visibleDetails" :key="d.typeName">
              <td class="font-semibold">{{ d.typeName }}</td>
              <td><span class="badge" :class="typeBadge(d.category)">{{ typeLabel(d.category) }}</span></td>
              <td>{{ d.initialQty.toFixed(1) }}</td><td>{{ d.totalSold.toFixed(1) }}</td>
              <td><span class="badge" :class="d.remaining < 0 ? 'badge-danger' : d.remaining === 0 ? 'badge-warning' : 'badge-neutral'">{{ d.remaining.toFixed(1) }}</span></td>
              <td><div class="progress"><div class="progress-fill" :class="{ danger: d.remaining < 0 }" :style="{ width: pct(d) + '%' }"></div></div><span class="text-sm text-muted">{{ pct(d).toFixed(0) }}%</span></td>
              <td class="font-semibold">{{ d.totalRevenue.toFixed(2) }}</td>
              <td>{{ d.totalCost.toFixed(2) }}</td>
              <td :class="d.profit >= 0 ? 'text-success' : 'text-danger'">{{ d.profit.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else-if="selectedPeriod" class="card empty-state"><div class="empty-icon">📊</div><p>لا توجد بيانات.</p></div>
  </div>
</template>

<script setup>
const route = useRoute()
const { options, typeLabel, typeBadge } = useProductTypes()
const tabs = [{ value: 'all', label: 'الكل' }, ...options.map(o => ({ value: o.value, label: `${o.icon} ${o.label}` }))]
const periods = ref([])
const selectedPeriod = ref('')
const stats = ref(null)
const activeTab = ref('all')
const summary = computed(() => activeTab.value === 'all' ? stats.value : stats.value.byCategory[activeTab.value])
const visibleDetails = computed(() => activeTab.value === 'all' ? stats.value.details : stats.value.details.filter(d => d.category === activeTab.value))
const pct = (d) => d.initialQty <= 0 ? 0 : Math.min(100, (d.totalSold / d.initialQty) * 100)
async function loadStats() { if (selectedPeriod.value) stats.value = await $fetch(`/api/stats/${selectedPeriod.value}`) }
const formatDate = d => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
onMounted(async () => {
  periods.value = await $fetch('/api/periods')
  if (route.query.period) { selectedPeriod.value = Number(route.query.period); await loadStats() }
})
</script>

<style scoped>
.stat-card { display: flex; flex-direction: column; gap: .35rem; padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-sm); }
.stat-label { font-size: .8rem; color: var(--text-muted); font-weight: 500; }
.stat-value { font-size: 1.5rem; font-weight: 700; font-family: 'Cairo', sans-serif; }
.type-tabs { display: flex; gap: .25rem; border-bottom: 1px solid var(--border); }
.type-tab { padding: .6rem 1rem; background: transparent; border: none; border-bottom: 2px solid transparent; margin-bottom: -1px; color: var(--text-muted); font-weight: 500; cursor: pointer; transition: all .15s; }
.type-tab:hover { color: var(--text); background: var(--ink-50); }
.type-tab--active { color: var(--primary); border-bottom-color: var(--primary); }
</style>
