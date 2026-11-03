import { s as ssrRenderList$2 } from './render-list-CXWS1OxD.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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

// app/pages/records.vue
var _sfc_main = {
	__name: "records",
	__ssrInlineRender: true,
	setup(__props) {
		const sales = ref([]);
		const periods = ref([]);
		const types = ref([]);
		const sellers = ref([]);
		const filters = reactive({
			periodId: "",
			typeId: "",
			seller: "",
			from: "",
			to: ""
		});
		const totalQty = computed(() => sales.value.reduce((s, x) => s + Number(x.quantityKg), 0));
		const totalRevenue = computed(() => sales.value.reduce((s, x) => s + Number(x.totalPrice), 0));
		const formatDate = (d) => new Date(d).toLocaleDateString("ar-EG", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
		const formatDateTime = (d) => new Date(d).toLocaleString("ar-EG", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-52f73c47><div class="mb-4" data-v-52f73c47><h1 data-v-52f73c47>سجل المبيعات</h1><p class="text-muted mt-1" data-v-52f73c47>جميع العمليات مع الفلترة</p></div><div class="card mb-4" data-v-52f73c47><div class="filters" data-v-52f73c47><div class="form-group" data-v-52f73c47><label class="form-label" data-v-52f73c47>الفترة</label><select class="select" data-v-52f73c47><option value="" data-v-52f73c47${ssrIncludeBooleanAttr(Array.isArray(unref(filters).periodId) ? ssrLooseContain(unref(filters).periodId, "") : ssrLooseEqual(unref(filters).periodId, "")) ? " selected" : ""}>الكل</option><!--[-->`);
			ssrRenderList$2(unref(periods), (p) => {
				_push(`<option${ssrRenderAttr("value", p.id)} data-v-52f73c47${ssrIncludeBooleanAttr(Array.isArray(unref(filters).periodId) ? ssrLooseContain(unref(filters).periodId, p.id) : ssrLooseEqual(unref(filters).periodId, p.id)) ? " selected" : ""}>${ssrInterpolate(p.name)} — ${ssrInterpolate(formatDate(p.startDate))}</option>`);
			});
			_push(`<!--]--></select></div><div class="form-group" data-v-52f73c47><label class="form-label" data-v-52f73c47>النوع</label><select class="select" data-v-52f73c47><option value="" data-v-52f73c47${ssrIncludeBooleanAttr(Array.isArray(unref(filters).typeId) ? ssrLooseContain(unref(filters).typeId, "") : ssrLooseEqual(unref(filters).typeId, "")) ? " selected" : ""}>الكل</option><!--[-->`);
			ssrRenderList$2(unref(types), (t) => {
				_push(`<option${ssrRenderAttr("value", t.id)} data-v-52f73c47${ssrIncludeBooleanAttr(Array.isArray(unref(filters).typeId) ? ssrLooseContain(unref(filters).typeId, t.id) : ssrLooseEqual(unref(filters).typeId, t.id)) ? " selected" : ""}>${ssrInterpolate(t.name)}</option>`);
			});
			_push(`<!--]--></select></div><div class="form-group" data-v-52f73c47><label class="form-label" data-v-52f73c47>البائع</label><select class="select" data-v-52f73c47><option value="" data-v-52f73c47${ssrIncludeBooleanAttr(Array.isArray(unref(filters).seller) ? ssrLooseContain(unref(filters).seller, "") : ssrLooseEqual(unref(filters).seller, "")) ? " selected" : ""}>الكل</option><!--[-->`);
			ssrRenderList$2(unref(sellers), (s) => {
				_push(`<option${ssrRenderAttr("value", s)} data-v-52f73c47${ssrIncludeBooleanAttr(Array.isArray(unref(filters).seller) ? ssrLooseContain(unref(filters).seller, s) : ssrLooseEqual(unref(filters).seller, s)) ? " selected" : ""}>${ssrInterpolate(s)}</option>`);
			});
			_push(`<!--]--></select></div><div class="form-group" data-v-52f73c47><label class="form-label" data-v-52f73c47>من</label><input${ssrRenderAttr("value", unref(filters).from)} type="date" class="input" data-v-52f73c47></div><div class="form-group" data-v-52f73c47><label class="form-label" data-v-52f73c47>إلى</label><input${ssrRenderAttr("value", unref(filters).to)} type="date" class="input" data-v-52f73c47></div><div class="form-group" data-v-52f73c47><label class="form-label" data-v-52f73c47> </label><button class="btn btn-secondary" data-v-52f73c47>مسح</button></div></div></div>`);
			if (unref(sales).length === 0) _push(`<div class="card empty-state" data-v-52f73c47><div class="empty-icon" data-v-52f73c47>📋</div><p data-v-52f73c47>لا توجد مبيعات مطابقة.</p></div>`);
			else {
				_push(`<div class="table-container" data-v-52f73c47><table class="table" data-v-52f73c47><thead data-v-52f73c47><tr data-v-52f73c47><th data-v-52f73c47>التاريخ</th><th data-v-52f73c47>النوع</th><th data-v-52f73c47>الكمية (كغ)</th><th data-v-52f73c47>سعر الكيلو</th><th data-v-52f73c47>الإجمالي</th><th data-v-52f73c47>البائع</th></tr></thead><tbody data-v-52f73c47><!--[-->`);
				ssrRenderList$2(unref(sales), (s) => {
					_push(`<tr data-v-52f73c47><td class="text-sm" data-v-52f73c47>${ssrInterpolate(formatDateTime(s.saleDate))}</td><td data-v-52f73c47>${ssrInterpolate(s.typeName)}</td><td data-v-52f73c47>${ssrInterpolate(Number(s.quantityKg).toFixed(1))}</td><td data-v-52f73c47>${ssrInterpolate(Number(s.pricePerKg).toFixed(2))}</td><td class="font-semibold" data-v-52f73c47>${ssrInterpolate(Number(s.totalPrice).toFixed(2))}</td><td data-v-52f73c47>${ssrInterpolate(s.sellerName)}</td></tr>`);
				});
				_push(`<!--]--></tbody><tfoot data-v-52f73c47><tr data-v-52f73c47><td colspan="2" data-v-52f73c47>الإجمالي (${ssrInterpolate(unref(sales).length)})</td><td data-v-52f73c47>${ssrInterpolate(unref(totalQty).toFixed(1))} كغ</td><td data-v-52f73c47>—</td><td class="text-success" data-v-52f73c47>${ssrInterpolate(unref(totalRevenue).toFixed(2))}</td><td data-v-52f73c47></td></tr></tfoot></table></div>`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/records.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var records_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-52f73c47"]]);

export { records_default as default };
//# sourceMappingURL=records-k3qLfO8e.mjs.map
