import { _ as _plugin_vue_export_helper_default, u as useRoute } from '../virtual/entry.mjs';
import { s as ssrRenderList$2 } from './render-list-CXWS1OxD.mjs';
import { ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
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

// app/pages/stats.vue
var _sfc_main = {
	__name: "stats",
	__ssrInlineRender: true,
	setup(__props) {
		useRoute();
		const periods = ref([]);
		const selectedPeriod = ref("");
		const stats = ref(null);
		const pct = (d) => d.initialQty <= 0 ? 0 : Math.min(100, d.totalSold / d.initialQty * 100);
		const formatDate = (d) => new Date(d).toLocaleDateString("ar-EG", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-86984ed1><div class="mb-4" data-v-86984ed1><h1 data-v-86984ed1>الإحصائيات</h1><p class="text-muted mt-1" data-v-86984ed1>تحليل أداء الفترة</p></div><div class="form-group mb-4" style="${ssrRenderStyle({ "max-width": "340px" })}" data-v-86984ed1><label class="form-label" data-v-86984ed1>اختر الفترة</label><select class="select" data-v-86984ed1><option value="" disabled data-v-86984ed1${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPeriod)) ? ssrLooseContain(unref(selectedPeriod), "") : ssrLooseEqual(unref(selectedPeriod), "")) ? " selected" : ""}>اختر فترة</option><!--[-->`);
			ssrRenderList$2(unref(periods), (p) => {
				_push(`<option${ssrRenderAttr("value", p.id)} data-v-86984ed1${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPeriod)) ? ssrLooseContain(unref(selectedPeriod), p.id) : ssrLooseEqual(unref(selectedPeriod), p.id)) ? " selected" : ""}>${ssrInterpolate(p.name)} — ${ssrInterpolate(formatDate(p.startDate))} ${ssrInterpolate(p.endDate ? "(منتهية)" : "(نشطة)")}</option>`);
			});
			_push(`<!--]--></select></div>`);
			if (unref(stats)) {
				_push(`<div class="animate-fade" data-v-86984ed1><div class="grid grid-cols-3 gap-3 mb-4" data-v-86984ed1><div class="stat-card" data-v-86984ed1><span class="stat-label" data-v-86984ed1>إجمالي الإيرادات</span><span class="stat-value text-success" data-v-86984ed1>${ssrInterpolate(unref(stats).totalRevenue.toFixed(2))}</span></div><div class="stat-card" data-v-86984ed1><span class="stat-label" data-v-86984ed1>إجمالي التكلفة</span><span class="stat-value" data-v-86984ed1>${ssrInterpolate(unref(stats).totalCost.toFixed(2))}</span></div><div class="stat-card" data-v-86984ed1><span class="stat-label" data-v-86984ed1>صافي الربح</span><span class="${ssrRenderClass([unref(stats).profit >= 0 ? "text-success" : "text-danger", "stat-value"])}" data-v-86984ed1>${ssrInterpolate(unref(stats).profit.toFixed(2))}</span></div></div><div class="table-container" data-v-86984ed1><table class="table" data-v-86984ed1><thead data-v-86984ed1><tr data-v-86984ed1><th data-v-86984ed1>النوع</th><th data-v-86984ed1>أولية (كغ)</th><th data-v-86984ed1>مباع (كغ)</th><th data-v-86984ed1>متبقي (كغ)</th><th style="${ssrRenderStyle({ "min-width": "120px" })}" data-v-86984ed1>نسبة البيع</th><th data-v-86984ed1>الإيراد</th></tr></thead><tbody data-v-86984ed1><!--[-->`);
				ssrRenderList$2(unref(stats).details, (d) => {
					_push(`<tr data-v-86984ed1><td class="font-semibold" data-v-86984ed1>${ssrInterpolate(d.typeName)}</td><td data-v-86984ed1>${ssrInterpolate(d.initialQty.toFixed(1))}</td><td data-v-86984ed1>${ssrInterpolate(d.totalSold.toFixed(1))}</td><td data-v-86984ed1><span class="${ssrRenderClass([d.remaining < 0 ? "badge-danger" : d.remaining === 0 ? "badge-warning" : "badge-neutral", "badge"])}" data-v-86984ed1>${ssrInterpolate(d.remaining.toFixed(1))}</span></td><td data-v-86984ed1><div class="progress" data-v-86984ed1><div class="${ssrRenderClass([{ danger: d.remaining < 0 }, "progress-fill"])}" style="${ssrRenderStyle({ width: pct(d) + "%" })}" data-v-86984ed1></div></div><span class="text-sm text-muted" data-v-86984ed1>${ssrInterpolate(pct(d).toFixed(0))}%</span></td><td class="font-semibold" data-v-86984ed1>${ssrInterpolate(d.totalRevenue.toFixed(2))}</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></div>`);
			} else if (unref(selectedPeriod)) _push(`<div class="card empty-state" data-v-86984ed1><div class="empty-icon" data-v-86984ed1>📊</div><p data-v-86984ed1>لا توجد بيانات.</p></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/stats.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var stats_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-86984ed1"]]);

export { stats_default as default };
//# sourceMappingURL=stats-Boq-nccC.mjs.map
