<template>
  <div class="invoice-wrap">
    <div class="mb-4"><h1>فاتورة مورد جديدة</h1><p class="text-muted mt-1">أدخل بيانات الفاتورة، ويمكنك إضافة الدفعات لاحقاً</p></div>
    <div class="card">
      <div class="form-group mb-3">
        <label class="form-label required">النوع</label>
        <div class="type-toggle">
          <button
            v-for="o in options" :key="o.value" type="button"
            class="type-option" :class="{ 'type-option--active': form.type === o.value }"
            @click="form.type = o.value"
          >{{ o.icon }} {{ o.label }}</button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="form-group">
          <label class="form-label required">الكمية (كغ)</label>
          <input v-model.number="form.quantity" type="number" min="0" step="0.1" class="input" />
        </div>
        <div class="form-group">
          <label class="form-label required">سعر الكيلو</label>
          <input v-model.number="form.pricePerKg" type="number" min="0" step="0.1" class="input" />
        </div>
      </div>
      <div class="total-box mb-4"><span class="text-muted">الإجمالي</span><span class="total-amount">{{ total.toFixed(2) }}</span></div>
      <div class="flex gap-2">
        <button class="btn btn-primary btn-lg flex-1" @click="submit" :disabled="!isValid || loading">{{ loading ? 'جارٍ الحفظ...' : 'حفظ الفاتورة' }}</button>
        <NuxtLink to="/invoices" class="btn btn-secondary btn-lg">إلغاء</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { notify } = useNotify()
const { options } = useProductTypes()
const form = reactive({ type: 'honey', quantity: 0, pricePerKg: 0 })
const loading = ref(false)
const total = computed(() => Math.round((form.quantity || 0) * (form.pricePerKg || 0) * 100) / 100)
const isValid = computed(() => form.type && form.quantity > 0 && form.pricePerKg > 0)

async function submit() {
  loading.value = true
  try {
    const { invoice } = await $fetch('/api/invoices', { method: 'POST', body: form })
    notify('تم حفظ الفاتورة')
    await navigateTo(`/invoices/${invoice.id}`)
  } catch (e) {
    notify(e.data?.statusMessage || 'فشل حفظ الفاتورة', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.invoice-wrap { max-width: 640px; margin: 0 auto; }
.grid-cols-2 { grid-template-columns: 1fr 1fr; }
.flex-1 { flex: 1; }
a.btn { text-decoration: none; }
.type-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
.type-option { padding: .7rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); cursor: pointer; font-weight: 500; transition: all .15s; }
.type-option:hover { border-color: var(--honey-300); }
.type-option--active { border-color: var(--primary); background: var(--honey-50); color: var(--honey-700); box-shadow: 0 0 0 3px rgba(212, 144, 26, 0.12); }
.total-box { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--honey-50); border-radius: var(--radius); border: 1px dashed var(--honey-200); }
.total-amount { font-size: 1.6rem; font-weight: 700; color: var(--honey-600); font-family: 'Cairo', sans-serif; }
</style>
