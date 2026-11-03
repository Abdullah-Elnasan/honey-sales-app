import { d as defineEventHandler, b as getQuery } from '../../_/nitro.mjs';
import { s as sales, d as db, h as honeyTypes } from '../../_/db.mjs';
import { eq, gte, lte, and, desc } from 'drizzle-orm';
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

const index_get = defineEventHandler(async (event) => {
  const q = getQuery(event);
  const conds = [];
  if (q.periodId) conds.push(eq(sales.periodId, Number(q.periodId)));
  if (q.typeId) conds.push(eq(sales.honeyTypeId, Number(q.typeId)));
  if (q.seller) conds.push(eq(sales.sellerName, q.seller));
  if (q.from) conds.push(gte(sales.saleDate, new Date(q.from)));
  if (q.to) conds.push(lte(sales.saleDate, new Date(q.to)));
  return db.select({
    id: sales.id,
    typeName: honeyTypes.name,
    quantityKg: sales.quantityKg,
    pricePerKg: sales.pricePerKg,
    totalPrice: sales.totalPrice,
    sellerName: sales.sellerName,
    saleDate: sales.saleDate,
    periodId: sales.periodId
  }).from(sales).leftJoin(honeyTypes, eq(sales.honeyTypeId, honeyTypes.id)).where(conds.length ? and(...conds) : void 0).orderBy(desc(sales.saleDate));
});

export { index_get as default };
//# sourceMappingURL=index2.get.mjs.map
