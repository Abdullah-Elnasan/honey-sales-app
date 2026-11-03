import { N as NuxtLink } from './nuxt-link-CnFQ_dxR.mjs';
import { u as useNotify } from './useNotify-wvp3sfDW.mjs';
import { s as ssrRenderList$2 } from './render-list-CXWS1OxD.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { ref, reactive, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
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

// app/pages/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useNotify();
		const periods = ref([]);
		const showForm = ref(false);
		const loading = ref(false);
		const form = reactive({
			name: "",
			startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			stock: [{
				typeName: "",
				quantityKg: 0,
				costPerKg: 0
			}]
		});
		const formatDate = (d) => new Date(d).toLocaleDateString("ar-EG", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-7aa48bc3><div class="flex items-center justify-between mb-4 flex-wrap gap-3" data-v-7aa48bc3><div data-v-7aa48bc3><h1 data-v-7aa48bc3>الفترات</h1><p class="text-muted mt-1" data-v-7aa48bc3>إدارة فترات البيع والمخزون</p></div><button class="btn btn-primary btn-lg" data-v-7aa48bc3>${ssrInterpolate(unref(showForm) ? "إلغاء" : "＋ فترة جديدة")}</button></div>`);
			if (unref(showForm)) {
				_push(`<div class="card mb-4 animate-fade" data-v-7aa48bc3><div class="card-header" data-v-7aa48bc3><h2 data-v-7aa48bc3>فترة جديدة</h2></div><div class="form-group mb-3" data-v-7aa48bc3><label class="form-label required" data-v-7aa48bc3>اسم الفترة</label><input${ssrRenderAttr("value", unref(form).name)} class="input" placeholder="مثال: موسم الربيع" data-v-7aa48bc3></div><div class="form-group mb-3" data-v-7aa48bc3><label class="form-label required" data-v-7aa48bc3>تاريخ البداية</label><input${ssrRenderAttr("value", unref(form).startDate)} type="date" class="input" data-v-7aa48bc3></div><label class="form-label mb-2" data-v-7aa48bc3>المخزون الأولي</label><div class="stock-list mb-3" data-v-7aa48bc3><!--[-->`);
				ssrRenderList$2(unref(form).stock, (item, i) => {
					_push(`<div class="stock-row" data-v-7aa48bc3><label class="stock-field" data-v-7aa48bc3><span class="form-label" data-v-7aa48bc3>نوع العسل</span><input${ssrRenderAttr("value", item.typeName)} class="input" placeholder="مثال: سدر" data-v-7aa48bc3></label><label class="stock-field" data-v-7aa48bc3><span class="form-label" data-v-7aa48bc3>الكمية (كغ)</span><input${ssrRenderAttr("value", item.quantityKg)} type="number" min="0" step="0.1" class="input" placeholder="0.0" data-v-7aa48bc3></label><label class="stock-field" data-v-7aa48bc3><span class="form-label" data-v-7aa48bc3>التكلفة لكل كغ</span><input${ssrRenderAttr("value", item.costPerKg)} type="number" min="0" step="0.1" class="input" placeholder="0.0" data-v-7aa48bc3></label><button class="btn btn-danger-ghost"${ssrIncludeBooleanAttr(unref(form).stock.length === 1) ? " disabled" : ""} data-v-7aa48bc3>✕</button></div>`);
				});
				_push(`<!--]--></div><button class="btn btn-secondary mb-4" data-v-7aa48bc3>＋ إضافة نوع</button><div class="flex gap-2" data-v-7aa48bc3><button class="btn btn-primary"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-7aa48bc3>${ssrInterpolate(unref(loading) ? "جارٍ الحفظ..." : "حفظ الفترة")}</button><button class="btn btn-secondary" data-v-7aa48bc3>إلغاء</button></div></div>`);
			} else _push(`<!---->`);
			if (unref(periods).length === 0) _push(`<div class="card empty-state" data-v-7aa48bc3><div class="empty-icon" data-v-7aa48bc3>📅</div><p data-v-7aa48bc3>لا توجد فترات بعد.</p></div>`);
			else _push(`<!---->`);
			_push(`<div class="periods-grid" data-v-7aa48bc3><!--[-->`);
			ssrRenderList$2(unref(periods), (p) => {
				_push(`<div class="card period-card" data-v-7aa48bc3><div class="flex items-center justify-between mb-3" data-v-7aa48bc3><div data-v-7aa48bc3><h3 data-v-7aa48bc3>${ssrInterpolate(p.name)}</h3><p class="text-sm text-muted" data-v-7aa48bc3>${ssrInterpolate(formatDate(p.startDate))}</p></div><span class="${ssrRenderClass([p.endDate ? "badge-neutral" : "badge-success", "badge"])}" data-v-7aa48bc3>${ssrInterpolate(p.endDate ? "منتهية" : "نشطة")}</span></div><div class="period-meta text-sm text-muted" data-v-7aa48bc3>`);
				if (p.endDate) _push(`<div data-v-7aa48bc3>انتهت: ${ssrInterpolate(formatDate(p.endDate))}</div>`);
				else _push(`<!---->`);
				_push(`<div data-v-7aa48bc3>${ssrInterpolate(p.typesCount)} نوع · ${ssrInterpolate(p.totalQty.toFixed(1))} كغ</div></div><div class="flex gap-2 mt-3" data-v-7aa48bc3>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: `/stats?period=${p.id}`,
					class: "btn btn-secondary"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`📊 الإحصائيات`);
						else return [createTextVNode("📊 الإحصائيات")];
					}),
					_: 2
				}, _parent));
				if (!p.endDate) _push(`<button class="btn btn-danger-ghost" data-v-7aa48bc3>إنهاء</button>`);
				else _push(`<!---->`);
				_push(`<button class="btn btn-danger-ghost" data-v-7aa48bc3>حذف</button></div></div>`);
			});
			_push(`<!--]--></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-7aa48bc3"]]);

export { pages_default as default };
//# sourceMappingURL=pages-B8CgB3Zl.mjs.map
