import { d as defineEventHandler, a as getRouterParam } from '../../../_/nitro.mjs';
import { d as db, p as periods } from '../../../_/db.mjs';
import { eq } from 'drizzle-orm';
import 'unhead/server';
import 'vue';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@neondatabase/serverless';
import 'drizzle-orm/neon-http';
import 'drizzle-orm/pg-core';

const _id__patch = defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  await db.update(periods).set({ endDate: /* @__PURE__ */ new Date() }).where(eq(periods.id, id));
  return { success: true };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
