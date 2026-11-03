import { t as tryUseNuxtApp, v as vforBound } from '../virtual/entry.mjs';
import { ssrRenderList } from 'vue/server-renderer';

// node_modules/.pnpm/nuxt@4.6.3_@babel+plugin-sy_aa9bb858657ddef6d04cd299b6b6416a/node_modules/nuxt/dist/app/components/render-list.js
function bound(source) {
	if (typeof source === "number" && source > 1e4 && tryUseNuxtApp()?.ssrContext?.islandContext) return vforBound(source);
	return source;
}
/**
* `ssrRenderList` from `vue/server-renderer`, with numeric sources clamped to
* `MAX_VFOR_LENGTH` while rendering a server component or island.
*
* @internal
*/
function ssrRenderList$2(source, renderItem) {
	ssrRenderList(bound(source), renderItem);
}

export { ssrRenderList$2 as s };
//# sourceMappingURL=render-list-CXWS1OxD.mjs.map
