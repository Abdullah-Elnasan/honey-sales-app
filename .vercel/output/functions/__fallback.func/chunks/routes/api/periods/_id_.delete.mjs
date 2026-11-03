import { d as defineEventHandler, a as getRouterParam, c as createError } from '../../../_/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 400, message: "\u0645\u0639\u0631\u0651\u0641 \u0627\u0644\u0641\u062A\u0631\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D" });
  }
  const [deletedPeriod] = await db.delete(periods).where(eq(periods.id, id)).returning({ id: periods.id });
  if (!deletedPeriod) {
    throw createError({ statusCode: 404, message: "\u0627\u0644\u0641\u062A\u0631\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
  }
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
