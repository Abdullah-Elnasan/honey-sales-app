<template>
  <div class="invoice-wrap">
    <div class="mb-4"><h1>فاتورة مورد جديدة</h1><p class="text-muted mt-1">أضف أصناف الفاتورة، ويمكنك إضافة الدفعات لاحقاً</p></div>
    <div class="card">
      <div class="card-header"><h2>الأصناف</h2><span class="badge badge-neutral">{{ items.length }} صنف</span></div>

      <div class="items-list mb-3">
        <div v-for="(item, i) in items" :key="item.key" class="item-row">
          <span class="item-index">{{ i + 1 }}</span>
          <label class="item-field">
            <span class="form-label required">النوع</span>
            <select v-model="item.productType" class="select">
              <option v-for="o in options" :key="o.value" :value="o.value">{{ o.icon }} {{ o.label }}</option>
            </select>
          </label>
          <label class="item-field item-field--name">
            <span class="form-label required">اسم الصنف</span>
            <input v-model="item.productName" class="input" placeholder="مثال: حبة البركة" />
          </label>
          <label class="item-field">
            <span class="form-label required">الكمية (كغ)</span>
            <input v-model.number="item.quantity" type="number" min="0" step="0.1" class="input" />
          </label>
          <label class="item-field">
            <span class="form-label required">سعر الكيلو</span>
            <input v-model.number="item.pricePerKg" type="number" min="0" step="0.1" class="input" />
          </label>
          <div class="item-field">
            <span class="form-label">الإجمالي</span>
            <span class="line-total">{{ lineTotal(item).toFixed(2) }}</span>
          </div>
          <button type="button" class="btn btn-danger" :disabled="items.length === 1" @click="removeItem(i)">حذف</button>
        </div>
      </div>

      <button type="button" class="btn btn-secondary mb-4" @click="addItem">+ إضافة صنف</button>

      <div class="total-box mb-4"><span class="text-muted">إجمالي الفاتورة</span><span class="total-amount">{{ total.toFixed(2) }}</span></div>
      <p v-if="!isValid" class="text-sm text-muted mb-3">أكمل النوع واسم الصنف والكمية والسعر لكل صنف.</p>
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
let nextKey = 0
const newItem = (productType = 'honey') => ({ key: nextKey++, productType, productName: '', quantity: 0, pricePerKg: 0 })
const items = ref([newItem()])
const loading = ref(false)

const round2 = n => Math.round(n * 100) / 100
const lineTotal = item => round2((item.quantity || 0) * (item.pricePerKg || 0))
const total = computed(() => round2(items.value.reduce((s, i) => s + lineTotal(i), 0)))
const itemValid = i => i.productType && i.productName.trim() && i.quantity > 0 && i.pricePerKg > 0
const isValid = computed(() => items.value.length > 0 && items.value.every(itemValid))

// الصنف الجديد يأخذ نوع آخر صنف لتسريع الإدخال
const addItem = () => items.value.push(newItem(items.value.at(-1)?.productType))
const removeItem = (i) => { if (items.value.length > 1) items.value.splice(i, 1) }

async function submit() {
  loading.value = true
  try {
    const body = { items: items.value.map(({ productType, productName, quantity, pricePerKg }) => ({ productType, productName: productName.trim(), quantity, pricePerKg })) }
    const { invoice } = await $fetch('/api/invoices', { method: 'POST', body })
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
.invoice-wrap { max-width: 1040px; margin: 0 auto; }
.flex-1 { flex: 1; }
a.btn { text-decoration: none; }
.items-list { display: flex; flex-direction: column; gap: .75rem; }
.item-row { display: grid; grid-template-columns: auto 1.1fr 2fr 1fr 1fr 1fr auto; gap: .5rem; align-items: end; padding-bottom: .75rem; border-bottom: 1px dashed var(--border); }
.item-row:last-child { border-bottom: none; padding-bottom: 0; }
.item-index { align-self: center; width: 1.75rem; height: 1.75rem; margin-top: 1.4rem; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: var(--honey-100); color: var(--honey-700); font-size: .8rem; font-weight: 700; }
.item-field { display: flex; flex-direction: column; gap: .35rem; min-width: 0; }
.line-total { padding: .65rem .85rem; border-radius: var(--radius-sm); background: var(--honey-50); color: var(--honey-700); font-weight: 700; font-family: 'Cairo', sans-serif; white-space: nowrap; }
.total-box { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--honey-50); border-radius: var(--radius); border: 1px dashed var(--honey-200); }
.total-amount { font-size: 1.6rem; font-weight: 700; color: var(--honey-600); font-family: 'Cairo', sans-serif; }
@media (max-width: 860px) {
  .item-row { grid-template-columns: 1fr 1fr; }
  .item-index { grid-column: 1 / -1; margin-top: 0; }
  .item-field--name { grid-column: 1 / -1; }
  .item-row > .btn { grid-column: 1 / -1; }
}
</style>
