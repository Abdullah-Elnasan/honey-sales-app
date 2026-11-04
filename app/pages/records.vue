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
    <div v-if="editingSale" class="card mb-4">
      <div class="card-header"><h2>تعديل سجل البيع</h2><button class="btn btn-ghost" @click="cancelEdit">إلغاء</button></div>
      <div class="edit-form">
        <div class="form-group">
          <label class="form-label required">الفترة</label>
          <select v-model.number="editForm.periodId" class="select" @change="onEditPeriodChange">
            <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.name }} — {{ formatDate(p.startDate) }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">نوع العسل</label>
          <select v-model.number="editForm.honeyTypeId" class="select" :disabled="editStockLoading">
            <option value="" disabled>اختر النوع</option>
            <option v-for="item in editStock" :key="item.typeId" :value="item.typeId">{{ item.typeName }} — متبقي {{ availableForEdit(item).toFixed(1) }} كغ</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">الكمية (كغ)</label>
          <input v-model.number="editForm.quantityKg" type="number" min="0" step="0.1" class="input" />
          <span v-if="editOverStock" class="text-danger text-sm">الكمية أكبر من المخزون المتاح</span>
        </div>
        <div class="form-group">
          <label class="form-label required">سعر الكيلو</label>
          <input v-model.number="editForm.pricePerKg" type="number" min="0" step="0.1" class="input" />
        </div>
        <div class="form-group">
          <label class="form-label required">البائع</label>
          <input v-model="editForm.sellerName" class="input" />
        </div>
        <div class="form-group">
          <label class="form-label required">اسم المشتري</label>
          <input v-model="editForm.buyerName" class="input" />
        </div>
        <div class="form-group">
          <label class="form-label required">حالة الدفع</label>
          <select v-model="editForm.paymentReceived" class="select">
            <option :value="false">لم يتم استلام الدفع</option>
            <option :value="true">تم استلام الدفع</option>
          </select>
        </div>
      </div>
      <div class="edit-actions">
        <button class="btn btn-primary" @click="saveEdit" :disabled="!editIsValid || savingEdit || editStockLoading">{{ savingEdit ? 'جارٍ الحفظ...' : 'حفظ التعديلات' }}</button>
        <button class="btn btn-secondary" @click="cancelEdit" :disabled="savingEdit">إلغاء</button>
      </div>
    </div>
    <div v-if="sales.length === 0" class="card empty-state"><div class="empty-icon">📋</div><p>لا توجد مبيعات مطابقة.</p></div>
    <div v-else class="table-container">
      <table class="table">
        <thead><tr><th>التاريخ</th><th>النوع</th><th>الكمية (كغ)</th><th>سعر الكيلو</th><th>الإجمالي</th><th>البائع</th><th>المشتري</th><th>الدفع</th><th>إجراءات</th></tr></thead>
        <tbody>
          <tr v-for="s in sales" :key="s.id">
            <td class="text-sm">{{ formatDateTime(s.saleDate) }}</td>
            <td>{{ s.typeName }}</td>
            <td>{{ Number(s.quantityKg).toFixed(1) }}</td>
            <td>{{ Number(s.pricePerKg).toFixed(2) }}</td>
            <td class="font-semibold">{{ Number(s.totalPrice).toFixed(2) }}</td>
            <td>{{ s.sellerName }}</td>
            <td>{{ s.buyerName || '—' }}</td>
            <td><span class="badge" :class="s.paymentReceived ? 'badge-success' : 'badge-warning'">{{ s.paymentReceived ? 'واصل' : 'غير واصل' }}</span></td>
            <td><button class="btn btn-secondary" @click="startEdit(s)">تعديل</button></td>
          </tr>
        </tbody>
        <tfoot><tr><td colspan="2">الإجمالي ({{ sales.length }})</td><td>{{ totalQty.toFixed(1) }} كغ</td><td>—</td><td class="text-success">{{ totalRevenue.toFixed(2) }}</td><td colspan="4"></td></tr></tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
const { notify } = useNotify()
const sales = ref([])
const periods = ref([])
const types = ref([])
const sellers = ref([])
const editingSale = ref(null)
const editStock = ref([])
const editStockLoading = ref(false)
const savingEdit = ref(false)
const editForm = reactive({ periodId: '', honeyTypeId: '', quantityKg: 0, pricePerKg: 0, sellerName: '', buyerName: '', paymentReceived: false })
const filters = reactive({ periodId: '', typeId: '', seller: '', from: '', to: '' })
const totalQty = computed(() => sales.value.reduce((s, x) => s + Number(x.quantityKg), 0))
const totalRevenue = computed(() => sales.value.reduce((s, x) => s + Number(x.totalPrice), 0))
const selectedEditStock = computed(() => editStock.value.find(item => item.typeId === editForm.honeyTypeId))
const editOverStock = computed(() => selectedEditStock.value && editForm.quantityKg > availableForEdit(selectedEditStock.value))
const editIsValid = computed(() => editForm.periodId && editForm.honeyTypeId && editForm.quantityKg > 0 && editForm.pricePerKg > 0 && editForm.sellerName.trim() && editForm.buyerName.trim() && !editOverStock.value)

async function fetchSales() {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
  sales.value = await $fetch(`/api/sales?${params}`)
}
function resetFilters() { Object.keys(filters).forEach(k => filters[k] = ''); fetchSales() }
async function loadEditStock() {
  editStockLoading.value = true
  try {
    editStock.value = await $fetch(`/api/periods/${editForm.periodId}/stock`)
  } catch (e) {
    notify(e.data?.statusMessage || 'تعذر تحميل المخزون', 'error')
    editStock.value = []
  } finally {
    editStockLoading.value = false
  }
}
function availableForEdit(item) {
  const isOriginalStock = editingSale.value &&
    Number(editingSale.value.periodId) === Number(editForm.periodId) &&
    Number(editingSale.value.honeyTypeId) === Number(item.typeId)
  return item.remaining + (isOriginalStock ? Number(editingSale.value.quantityKg) : 0)
}
async function startEdit(sale) {
  editingSale.value = sale
  Object.assign(editForm, {
    periodId: sale.periodId,
    honeyTypeId: sale.honeyTypeId,
    quantityKg: Number(sale.quantityKg),
    pricePerKg: Number(sale.pricePerKg),
    sellerName: sale.sellerName,
    buyerName: sale.buyerName || '',
    paymentReceived: Boolean(sale.paymentReceived),
  })
  await loadEditStock()
}
async function onEditPeriodChange() {
  editForm.honeyTypeId = ''
  await loadEditStock()
}
function cancelEdit() {
  editingSale.value = null
  editStock.value = []
}
async function saveEdit() {
  if (!editingSale.value) return
  savingEdit.value = true
  try {
    await $fetch(`/api/sales/${editingSale.value.id}`, { method: 'PATCH', body: editForm })
  } catch (e) {
    notify(e.data?.statusMessage || 'فشل تعديل سجل البيع', 'error')
    return
  } finally {
    savingEdit.value = false
  }
  notify('تم تعديل سجل البيع')
  cancelEdit()
  try {
    await Promise.all([
      fetchSales(),
      $fetch('/api/sellers').then((result) => { sellers.value = result }),
    ])
  } catch (e) {
    notify(e.data?.statusMessage || 'تم التعديل، لكن تعذر تحديث البيانات المعروضة', 'error')
  }
}
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
.edit-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 0 1rem; }
.edit-actions { display: flex; gap: .75rem; }
</style>