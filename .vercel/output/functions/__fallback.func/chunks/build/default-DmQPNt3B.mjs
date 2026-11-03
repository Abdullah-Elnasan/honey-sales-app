import { N as NuxtLink } from './nuxt-link-CnFQ_dxR.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
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

// app/layouts/default.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_NuxtLink = NuxtLink;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "app-shell" }, _attrs))} data-v-c38db034><header class="app-header" data-v-c38db034><div class="header-inner" data-v-c38db034><div class="brand" data-v-c38db034><span class="brand-icon" data-v-c38db034>🍯</span><div data-v-c38db034><h1 class="brand-name" data-v-c38db034>حسابات العسل</h1><p class="brand-sub" data-v-c38db034>نظام إدارة المبيعات</p></div></div><nav class="nav-tabs" data-v-c38db034>`);
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: "/",
		class: "nav-tab",
		"active-class": "nav-tab--active"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`<span class="nav-icon" data-v-c38db034${_scopeId}>📅</span><span data-v-c38db034${_scopeId}>الفترات</span>`);
			else return [createVNode("span", { class: "nav-icon" }, "📅"), createVNode("span", null, "الفترات")];
		}),
		_: 1
	}, _parent));
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: "/sales",
		class: "nav-tab",
		"active-class": "nav-tab--active"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`<span class="nav-icon" data-v-c38db034${_scopeId}>➕</span><span data-v-c38db034${_scopeId}>تسجيل بيع</span>`);
			else return [createVNode("span", { class: "nav-icon" }, "➕"), createVNode("span", null, "تسجيل بيع")];
		}),
		_: 1
	}, _parent));
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: "/records",
		class: "nav-tab",
		"active-class": "nav-tab--active"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`<span class="nav-icon" data-v-c38db034${_scopeId}>📋</span><span data-v-c38db034${_scopeId}>سجل المبيعات</span>`);
			else return [createVNode("span", { class: "nav-icon" }, "📋"), createVNode("span", null, "سجل المبيعات")];
		}),
		_: 1
	}, _parent));
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: "/stats",
		class: "nav-tab",
		"active-class": "nav-tab--active"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`<span class="nav-icon" data-v-c38db034${_scopeId}>📊</span><span data-v-c38db034${_scopeId}>الإحصائيات</span>`);
			else return [createVNode("span", { class: "nav-icon" }, "📊"), createVNode("span", null, "الإحصائيات")];
		}),
		_: 1
	}, _parent));
	_push(`</nav></div></header><main class="app-main" data-v-c38db034>`);
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</main></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c38db034"]]);

export { default_default as default };
//# sourceMappingURL=default-DmQPNt3B.mjs.map
