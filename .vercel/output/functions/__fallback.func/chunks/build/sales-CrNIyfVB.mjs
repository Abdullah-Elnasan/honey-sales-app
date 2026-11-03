import { u as useNotify } from './useNotify-wvp3sfDW.mjs';
import { s as ssrRenderList$2 } from './render-list-CXWS1OxD.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { reactive, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import 'node:module';
import 'node:buffer';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:events';
import 'node:crypto';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';

// app/pages/sales.vue
var _sfc_main = {
	__name: "sales",
	__ssrInlineRender: true,
	setup(__props) {
		useNotify();
		const form = reactive({
			periodId: "",
			honeyTypeId: "",
			quantityKg: 0,
			pricePerKg: 0,
			sellerName: ""
		});
		const periods = ref([]);
		const currentStock = ref([]);
		const loading = ref(false);
		const activePeriods = computed(() => periods.value.filter((p) => !p.endDate));
		const selectedStock = computed(() => currentStock.value.find((s) => s.typeId === form.honeyTypeId));
		const totalAmount = computed(() => (form.quantityKg || 0) * (form.pricePerKg || 0));
		const overStock = computed(() => selectedStock.value && form.quantityKg > selectedStock.value.remaining);
		const isValid = computed(() => form.periodId && form.honeyTypeId && form.quantityKg > 0 && form.pricePerKg > 0 && form.sellerName.trim() && !overStock.value);
		const formatDate = (d) => new Date(d).toLocaleDateString("ar-EG", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "sales-wrap" }, _attrs))} data-v-bd11fc43><div class="mb-4" data-v-bd11fc43><h1 data-v-bd11fc43>تسجيل عملية بيع</h1><p class="text-muted mt-1" data-v-bd11fc43>أدخل بيانات البيع</p></div><div class="card" data-v-bd11fc43><div class="form-group mb-3" data-v-bd11fc43><label class="form-label required" data-v-bd11fc43>الفترة</label><select class="select" data-v-bd11fc43><option value="" disabled data-v-bd11fc43${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodId) ? ssrLooseContain(unref(form).periodId, "") : ssrLooseEqual(unref(form).periodId, "")) ? " selected" : ""}>اختر الفترة</option><!--[-->`);
			ssrRenderList$2(unref(activePeriods), (p) => {
				_push(`<option${ssrRenderAttr("value", p.id)} data-v-bd11fc43${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodId) ? ssrLooseContain(unref(form).periodId, p.id) : ssrLooseEqual(unref(form).periodId, p.id)) ? " selected" : ""}>${ssrInterpolate(p.name)} — ${ssrInterpolate(formatDate(p.startDate))}</option>`);
			});
			_push(`<!--]--></select></div><div class="form-group mb-3" data-v-bd11fc43><label class="form-label required" data-v-bd11fc43>نوع العسل</label><select class="select"${ssrIncludeBooleanAttr(!unref(form).periodId) ? " disabled" : ""} data-v-bd11fc43><option value="" disabled data-v-bd11fc43${ssrIncludeBooleanAttr(Array.isArray(unref(form).honeyTypeId) ? ssrLooseContain(unref(form).honeyTypeId, "") : ssrLooseEqual(unref(form).honeyTypeId, "")) ? " selected" : ""}>${ssrInterpolate(unref(form).periodId ? "اختر النوع" : "اختر الفترة أولاً")}</option><!--[-->`);
			ssrRenderList$2(unref(currentStock), (s) => {
				_push(`<option${ssrRenderAttr("value", s.typeId)} data-v-bd11fc43${ssrIncludeBooleanAttr(Array.isArray(unref(form).honeyTypeId) ? ssrLooseContain(unref(form).honeyTypeId, s.typeId) : ssrLooseEqual(unref(form).honeyTypeId, s.typeId)) ? " selected" : ""}>${ssrInterpolate(s.typeName)} — متبقي ${ssrInterpolate(s.remaining.toFixed(1))} كغ</option>`);
			});
			_push(`<!--]--></select></div>`);
			if (unref(selectedStock)) _push(`<div class="info-box mb-3" data-v-bd11fc43> المخزون المتبقي: <span class="${ssrRenderClass([unref(selectedStock).remaining > 0 ? "badge-success" : "badge-danger", "badge"])}" data-v-bd11fc43>${ssrInterpolate(unref(selectedStock).remaining.toFixed(1))} كغ</span></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-2 gap-3 mb-3" data-v-bd11fc43><div class="form-group" data-v-bd11fc43><label class="form-label required" data-v-bd11fc43>الكمية (كغ)</label><input${ssrRenderAttr("value", unref(form).quantityKg)} type="number" min="0" step="0.1" class="input" data-v-bd11fc43>`);
			if (unref(overStock)) _push(`<span class="text-danger text-sm" data-v-bd11fc43>⚠ الكمية أكبر من المتوفر</span>`);
			else _push(`<!---->`);
			_push(`</div><div class="form-group" data-v-bd11fc43><label class="form-label required" data-v-bd11fc43>سعر الكيلو</label><input${ssrRenderAttr("value", unref(form).pricePerKg)} type="number" min="0" step="0.1" class="input" data-v-bd11fc43></div></div><div class="form-group mb-3" data-v-bd11fc43><label class="form-label required" data-v-bd11fc43>البائع</label><input${ssrRenderAttr("value", unref(form).sellerName)} class="input" placeholder="اسم البائع" data-v-bd11fc43></div><div class="total-box mb-4" data-v-bd11fc43><span class="text-muted" data-v-bd11fc43>الإجمالي</span><span class="total-amount" data-v-bd11fc43>${ssrInterpolate(unref(totalAmount).toFixed(2))}</span></div><button class="btn btn-primary btn-lg w-full"${ssrIncludeBooleanAttr(!unref(isValid) || unref(loading)) ? " disabled" : ""} data-v-bd11fc43>${ssrInterpolate(unref(loading) ? "جارٍ الحفظ..." : "تسجيل البيع")}</button></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sales.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var sales_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-bd11fc43"]]);

export { sales_default as default };
//# sourceMappingURL=sales-CrNIyfVB.mjs.map
