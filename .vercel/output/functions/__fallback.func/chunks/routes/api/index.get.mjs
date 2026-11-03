import { d as defineEventHandler } from '../../_/nitro.mjs';
import { d as db, p as periods, a as periodStock } from '../../_/db.mjs';
import { desc, sum, count } from 'drizzle-orm';
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

const index_get = defineEventHandler(async () => {
  const list = await db.select().from(periods).orderBy(desc(periods.startDate));
  const summaries = await db.select({
    periodId: periodStock.periodId,
    typesCount: count(periodStock.id),
    totalQty: sum(periodStock.quantityKg)
  }).from(periodStock).groupBy(periodStock.periodId);
  const map = new Map(summaries.map((s) => [s.periodId, s]));
  return list.map((p) => {
    var _a, _b, _c, _d;
    return {
      ...p,
      typesCount: Number((_b = (_a = map.get(p.id)) == null ? void 0 : _a.typesCount) != null ? _b : 0),
      totalQty: Number((_d = (_c = map.get(p.id)) == null ? void 0 : _c.totalQty) != null ? _d : 0)
    };
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
