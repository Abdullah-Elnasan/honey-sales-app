<template>
  <div>
    <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div>
        <h1>الفترات</h1>
        <p class="text-muted mt-1">إدارة فترات البيع والمخزون</p>
      </div>
      <button class="btn btn-primary btn-lg" @click="toggleForm">
        {{ showForm ? 'إلغاء' : '＋ فترة جديدة' }}
      </button>
    </div>

    <div v-if="showForm" class="card mb-4 animate-fade">
      <div class="card-header"><h2>فترة جديدة</h2></div>
      <div class="form-group mb-3">
        <label class="form-label required">اسم الفترة</label>
        <input v-model="form.name" class="input" placeholder="مثال: موسم الربيع" />
      </div>
      <div class="form-group mb-3">
        <label class="form-label required">تاريخ البداية</label>
        <input v-model="form.startDate" type="date" class="input" />
      </div>

      <label class="form-label mb-2">المخزون الأولي</label>
      <div class="stock-list mb-3">
        <div v-for="(item, i) in form.stock" :key="i" class="stock-row">
          <label class="stock-field">
            <span class="form-label">نوع العسل</span>
            <input v-model="item.typeName" class="input" placeholder="مثال: سدر" />
          </label>
          <label class="stock-field">
            <span class="form-label">الكمية (كغ)</span>
            <input v-model.number="item.quantityKg" type="number" min="0" step="0.1" class="input" placeholder="0.0" />
          </label>
          <label class="stock-field">
            <span class="form-label">التكلفة لكل كغ</span>
            <input v-model.number="item.costPerKg" type="number" min="0" step="0.1" class="input" placeholder="0.0" />
          </label>
          <button class="btn btn-danger-ghost" @click="form.stock.splice(i, 1)" :disabled="form.stock.length === 1">✕</button>
        </div>
      </div>
      <button class="btn btn-secondary mb-4" @click="addStockRow">＋ إضافة نوع</button>
      <div class="flex gap-2">
        <button class="btn btn-primary" @click="createPeriod" :disabled="loading">{{ loading ? 'جارٍ الحفظ...' : 'حفظ الفترة' }}</button>
        <button class="btn btn-secondary" @click="toggleForm">إلغاء</button>
      </div>
    </div>

    <div v-if="periods.length === 0" class="card empty-state">
      <div class="empty-icon">📅</div>
      <p>لا توجد فترات بعد.</p>
    </div>

    <div class="periods-grid">
      <div v-for="p in periods" :key="p.id" class="card period-card">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3>{{ p.name }}</h3>
            <p class="text-sm text-muted">{{ formatDate(p.startDate) }}</p>
          </div>
          <span class="badge" :class="p.endDate ? 'badge-neutral' : 'badge-success'">{{ p.endDate ? 'منتهية' : 'نشطة' }}</span>
        </div>
        <div class="period-meta text-sm text-muted">
          <div v-if="p.endDate">انتهت: {{ formatDate(p.endDate) }}</div>
          <div>{{ p.typesCount }} نوع · {{ p.totalQty.toFixed(1) }} كغ</div>
        </div>
        <div class="flex gap-2 mt-3">
          <NuxtLink :to="`/stats?period=${p.id}`" class="btn btn-secondary">📊 الإحصائيات</NuxtLink>
          <button v-if="!p.endDate" class="btn btn-danger-ghost" @click="endPeriod(p.id)">إنهاء</button>
          <button class="btn btn-danger-ghost" @click="deletePeriod(p)">حذف</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { notify } = useNotify()
const periods = ref([])
const showForm = ref(false)
const loading = ref(false)
const form = reactive({ name: '', startDate: new Date().toISOString().slice(0, 10), stock: [{ typeName: '', quantityKg: 0, costPerKg: 0 }] })

const addStockRow = () => form.stock.push({ typeName: '', quantityKg: 0, costPerKg: 0 })
const toggleForm = () => { showForm.value = !showForm.value; if (!showForm.value) resetForm() }
const resetForm = () => { form.name = ''; form.startDate = new Date().toISOString().slice(0, 10); form.stock = [{ typeName: '', quantityKg: 0, costPerKg: 0 }] }

async function fetchPeriods() { periods.value = await $fetch('/api/periods') }

async function createPeriod() {
  if (!form.name.trim()) return notify('أدخل اسم الفترة', 'error')
  if (!form.startDate) return notify('اختر التاريخ', 'error')
  const validStock = form.stock.filter(s => s.typeName.trim() && s.quantityKg > 0)
  if (!validStock.length) return notify('أضف نوعاً صالحاً', 'error')
  loading.value = true
  try {
    await $fetch('/api/periods', { method: 'POST', body: { name: form.name, startDate: form.startDate, stock: validStock } })
    notify('تم إنشاء الفترة')
    showForm.value = false
    resetForm()
    await fetchPeriods()
  } catch (e) { notify('فشل الإنشاء', 'error') } finally { loading.value = false }
}

async function endPeriod(id) {
  if (!confirm('هل تريد إنهاء الفترة؟')) return
  await $fetch(`/api/periods/${id}`, { method: 'PATCH' })
  notify('تم إنهاء الفترة')
  await fetchPeriods()
}
async function deletePeriod(period) {
  if (!confirm(`هل تريد حذف الفترة "${period.name}"؟ سيتم حذف مخزونها ومبيعاتها نهائياً.`)) return
  try {
    await $fetch(`/api/periods/${period.id}`, { method: 'DELETE' })
    notify('تم حذف الفترة')
    await fetchPeriods()
  } catch {
    notify('فشل حذف الفترة', 'error')
  }
}
const formatDate = d => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
onMounted(fetchPeriods)
</script>

<style scoped>
.stock-list { display: flex; flex-direction: column; gap: .5rem; }
.stock-row { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: .5rem; align-items: end; }
.stock-field { display: flex; flex-direction: column; gap: .35rem; }
.periods-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.period-meta { display: flex; flex-direction: column; gap: .25rem; }
@media (max-width: 640px) { .stock-row { grid-template-columns: 1fr 1fr; } .stock-row > :last-child { grid-column: 1 / -1; } }
</style>