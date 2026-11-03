import { s as stateDiagnostics, a as useNuxtApp } from '../virtual/entry.mjs';
import { toRef, isRef } from 'vue';

// node_modules/.pnpm/nuxt@4.6.3_@babel+plugin-sy_aa9bb858657ddef6d04cd299b6b6416a/node_modules/nuxt/dist/app/composables/state.js
var useStateKeyPrefix = "$s";
function useState(...args) {
	const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
	if (typeof args[0] !== "string") args.unshift(autoKey);
	const [_key, init] = args;
	if (!_key || typeof _key !== "string") throw stateDiagnostics.NUXT_E7009({ key: _key });
	if (init !== void 0 && typeof init !== "function") throw stateDiagnostics.NUXT_E7007({ type: typeof init });
	const key = useStateKeyPrefix + _key;
	const nuxtApp = useNuxtApp();
	const state = toRef(nuxtApp.payload.state, key);
	if (init) nuxtApp._state[key] ??= { _default: init };
	if (state.value === void 0 && init) {
		const initialValue = init();
		if (isRef(initialValue)) {
			nuxtApp.payload.state[key] = initialValue;
			return state;
		}
		state.value = initialValue;
	}
	return state;
}
// app/composables/useNotify.ts
var useNotify = () => {
	const notifications = useState("notifications", () => []);
	const notify = (message, type = "success") => {
		const id = Date.now();
		notifications.value.push({
			id,
			message,
			type
		});
		setTimeout(() => {
			notifications.value = notifications.value.filter((n) => n.id !== id);
		}, 3e3);
	};
	return {
		notifications,
		notify
	};
};

export { useNotify as u };
//# sourceMappingURL=useNotify-wvp3sfDW.mjs.map
