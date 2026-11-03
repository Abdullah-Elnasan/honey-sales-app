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
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="stat-card"><span class="stat-label">إجمالي الإيرادات</span><span class="stat-value text-success">{{ stats.totalRevenue.toFixed(2) }}</span></div>
        <div class="stat-card"><span class="stat-label">إجمالي التكلفة</span><span class="stat-value">{{ stats.totalCost.toFixed(2) }}</span></div>
        <div class="stat-card"><span class="stat-label">صافي الربح</span><span class="stat-value" :class="stats.profit >= 0 ? 'text-success' : 'text-danger'">{{ stats.profit.toFixed(2) }}</span></div>
      </div>
      <div class="table-container">
        <table class="table">
          <thead><tr><th>النوع</th><th>أولية (كغ)</th><th>مباع (كغ)</th><th>متبقي (كغ)</th><th style="min-width: 120px;">نسبة البيع</th><th>الإيراد</th></tr></thead>
          <tbody>
            <tr v-for="d in stats.details" :key="d.typeName">
              <td class="font-semibold">{{ d.typeName }}</td><td>{{ d.initialQty.toFixed(1) }}</td><td>{{ d.totalSold.toFixed(1) }}</td>
              <td><span class="badge" :class="d.remaining < 0 ? 'badge-danger' : d.remaining === 0 ? 'badge-warning' : 'badge-neutral'">{{ d.remaining.toFixed(1) }}</span></td>
              <td><div class="progress"><div class="progress-fill" :class="{ danger: d.remaining < 0 }" :style="{ width: pct(d) + '%' }"></div></div><span class="text-sm text-muted">{{ pct(d).toFixed(0) }}%</span></td>
              <td class="font-semibold">{{ d.totalRevenue.toFixed(2) }}</td>
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
const periods = ref([])
const selectedPeriod = ref('')
const stats = ref(null)
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
</style>