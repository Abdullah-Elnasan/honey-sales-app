<template>
  <div class="sales-wrap">
    <div class="mb-4"><h1>تسجيل عملية بيع</h1><p class="text-muted mt-1">أدخل بيانات البيع</p></div>
    <div class="card">
      <div class="form-group mb-3">
        <label class="form-label required">الفترة</label>
        <select v-model="form.periodId" class="select" @change="onPeriodChange">
          <option value="" disabled>اختر الفترة</option>
          <option v-for="p in activePeriods" :key="p.id" :value="p.id">{{ p.name }} — {{ formatDate(p.startDate) }}</option>
        </select>
      </div>
      <div class="form-group mb-3">
        <label class="form-label required">نوع العسل</label>
        <select v-model="form.honeyTypeId" class="select" :disabled="!form.periodId">
          <option value="" disabled>{{ form.periodId ? 'اختر النوع' : 'اختر الفترة أولاً' }}</option>
          <option v-for="s in currentStock" :key="s.typeId" :value="s.typeId">{{ s.typeName }} — متبقي {{ s.remaining.toFixed(1) }} كغ</option>
        </select>
      </div>
      <div v-if="selectedStock" class="info-box mb-3">
        المخزون المتبقي: <span class="badge" :class="selectedStock.remaining > 0 ? 'badge-success' : 'badge-danger'">{{ selectedStock.remaining.toFixed(1) }} كغ</span>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="form-group">
          <label class="form-label required">الكمية (كغ)</label>
          <input v-model.number="form.quantityKg" type="number" min="0" step="0.1" class="input" />
          <span v-if="overStock" class="text-danger text-sm">⚠ الكمية أكبر من المتوفر</span>
        </div>
        <div class="form-group">
          <label class="form-label required">سعر الكيلو</label>
          <input v-model.number="form.pricePerKg" type="number" min="0" step="0.1" class="input" />
        </div>
      </div>
      <div class="form-group mb-3">
        <label class="form-label required">البائع</label>
        <input v-model="form.sellerName" class="input" placeholder="اسم البائع" />
      </div>
      <div class="total-box mb-4"><span class="text-muted">الإجمالي</span><span class="total-amount">{{ totalAmount.toFixed(2) }}</span></div>
      <button class="btn btn-primary btn-lg w-full" @click="submit" :disabled="!isValid || loading">{{ loading ? 'جارٍ الحفظ...' : 'تسجيل البيع' }}</button>
    </div>
  </div>
</template>

<script setup>
const { notify } = useNotify()
const form = reactive({ periodId: '', honeyTypeId: '', quantityKg: 0, pricePerKg: 0, sellerName: '' })
const periods = ref([])
const currentStock = ref([])
const loading = ref(false)
const activePeriods = computed(() => periods.value.filter(p => !p.endDate))
const selectedStock = computed(() => currentStock.value.find(s => s.typeId === form.honeyTypeId))
const totalAmount = computed(() => (form.quantityKg || 0) * (form.pricePerKg || 0))
const overStock = computed(() => selectedStock.value && form.quantityKg > selectedStock.value.remaining)
const isValid = computed(() => form.periodId && form.honeyTypeId && form.quantityKg > 0 && form.pricePerKg > 0 && form.sellerName.trim() && !overStock.value)

async function onPeriodChange() {
  form.honeyTypeId = ''
  currentStock.value = form.periodId ? await $fetch(`/api/periods/${form.periodId}/stock`) : []
}
async function submit() {
  loading.value = true
  try {
    await $fetch('/api/sales', { method: 'POST', body: form })
    notify('تم تسجيل البيع')
    form.honeyTypeId = ''; form.quantityKg = 0; form.pricePerKg = 0; form.sellerName = '';
    await onPeriodChange()
  } catch (e) { notify('فشل التسجيل', 'error') } finally { loading.value = false }
}
const formatDate = d => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
onMounted(async () => { periods.value = await $fetch('/api/periods') })
</script>

<style scoped>
.sales-wrap { max-width: 640px; margin: 0 auto; }
.info-box { padding: .7rem 1rem; background: var(--honey-50); border-radius: var(--radius-sm); font-size: .9rem; }
.total-box { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--honey-50); border-radius: var(--radius); border: 1px dashed var(--honey-200); }
.total-amount { font-size: 1.6rem; font-weight: 700; color: var(--honey-600); font-family: 'Cairo', sans-serif; }
</style>