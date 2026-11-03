import { d as defineEventHandler, a as getRouterParam } from '../../../../_/nitro.mjs';
import { d as db, a as periodStock, h as honeyTypes, s as sales } from '../../../../_/db.mjs';
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

const stock_get = defineEventHandler(async (event) => {
  var _a;
  const periodId = Number(getRouterParam(event, "id"));
  const stock = await db.select({
    typeId: periodStock.honeyTypeId,
    typeName: honeyTypes.name,
    initialQty: periodStock.quantityKg,
    costPerKg: periodStock.costPerKg
  }).from(periodStock).leftJoin(honeyTypes, eq(periodStock.honeyTypeId, honeyTypes.id)).where(eq(periodStock.periodId, periodId));
  const sold = await db.select({
    typeId: sales.honeyTypeId,
    qty: sales.quantityKg
  }).from(sales).where(eq(sales.periodId, periodId));
  const soldMap = /* @__PURE__ */ new Map();
  for (const s of sold) {
    soldMap.set(s.typeId, ((_a = soldMap.get(s.typeId)) != null ? _a : 0) + Number(s.qty));
  }
  return stock.map((item) => {
    var _a2;
    const soldQty = (_a2 = soldMap.get(item.typeId)) != null ? _a2 : 0;
    return {
      typeId: item.typeId,
      typeName: item.typeName,
      initialQty: Number(item.initialQty),
      costPerKg: Number(item.costPerKg),
      soldQty,
      remaining: Number(item.initialQty) - soldQty
    };
  });
});

export { stock_get as default };
//# sourceMappingURL=stock.get.mjs.map
