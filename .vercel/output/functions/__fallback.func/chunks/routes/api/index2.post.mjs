import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { d as db, s as sales } from '../../_/db.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const totalPrice = body.quantityKg * body.pricePerKg;
  const [sale] = await db.insert(sales).values({
    periodId: body.periodId,
    honeyTypeId: body.honeyTypeId,
    quantityKg: body.quantityKg.toString(),
    pricePerKg: body.pricePerKg.toString(),
    totalPrice: totalPrice.toString(),
    sellerName: body.sellerName
  }).returning();
  return { success: true, sale };
});

export { index_post as default };
//# sourceMappingURL=index2.post.mjs.map
