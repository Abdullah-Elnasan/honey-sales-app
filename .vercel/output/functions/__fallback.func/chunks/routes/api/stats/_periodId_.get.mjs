import { d as defineEventHandler, a as getRouterParam } from '../../../_/nitro.mjs';
import { d as db, a as periodStock, h as honeyTypes, s as sales } from '../../../_/db.mjs';
import { eq, sum } from 'drizzle-orm';
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

const _periodId__get = defineEventHandler(async (event) => {
  const periodId = Number(getRouterParam(event, "periodId"));
  const stock = await db.select({
    typeId: periodStock.honeyTypeId,
    typeName: honeyTypes.name,
    initialQty: periodStock.quantityKg,
    costPerKg: periodStock.costPerKg
  }).from(periodStock).leftJoin(honeyTypes, eq(periodStock.honeyTypeId, honeyTypes.id)).where(eq(periodStock.periodId, periodId));
  const sold = await db.select({
    typeId: sales.honeyTypeId,
    totalSold: sum(sales.quantityKg).as("total_sold"),
    totalRevenue: sum(sales.totalPrice).as("total_revenue")
  }).from(sales).where(eq(sales.periodId, periodId)).groupBy(sales.honeyTypeId);
  const soldMap = new Map(sold.map((s) => [s.typeId, s]));
  const details = stock.map((item) => {
    var _a, _b;
    const soldItem = soldMap.get(item.typeId);
    const totalSold = Number((_a = soldItem == null ? void 0 : soldItem.totalSold) != null ? _a : 0);
    const remaining = Number(item.initialQty) - totalSold;
    return {
      typeName: item.typeName,
      initialQty: Number(item.initialQty),
      totalSold,
      remaining,
      totalRevenue: Number((_b = soldItem == null ? void 0 : soldItem.totalRevenue) != null ? _b : 0),
      costPerKg: Number(item.costPerKg)
    };
  });
  const totalRevenue = details.reduce((s, d) => s + d.totalRevenue, 0);
  const totalCost = details.reduce((s, d) => s + d.totalSold * d.costPerKg, 0);
  return { details, totalRevenue, totalCost, profit: totalRevenue - totalCost };
});

export { _periodId__get as default };
//# sourceMappingURL=_periodId_.get.mjs.map
