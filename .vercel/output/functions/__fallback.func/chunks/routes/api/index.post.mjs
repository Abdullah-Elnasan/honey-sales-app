import { d as defineEventHandler, r as readBody, c as createError } from '../../_/nitro.mjs';
import { d as db, p as periods, h as honeyTypes, a as periodStock } from '../../_/db.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    throw createError({ statusCode: 400, message: "\u0627\u0633\u0645 \u0627\u0644\u0641\u062A\u0631\u0629 \u0645\u0637\u0644\u0648\u0628" });
  }
  const [period] = await db.insert(periods).values({
    name,
    startDate: new Date(body.startDate)
  }).returning();
  if (!period) {
    throw createError({ statusCode: 500, message: "\u0641\u0634\u0644 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0641\u062A\u0631\u0629" });
  }
  for (const item of body.stock) {
    const [type] = await db.insert(honeyTypes).values({ name: item.typeName }).onConflictDoNothing().returning();
    let typeId;
    if (type) {
      typeId = type.id;
    } else {
      const existing = await db.select().from(honeyTypes).where(eq(honeyTypes.name, item.typeName));
      const existingType = existing[0];
      if (!existingType) {
        throw createError({ statusCode: 500, message: `\u0641\u0634\u0644 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0646\u0648\u0639: ${item.typeName}` });
      }
      typeId = existingType.id;
    }
    await db.insert(periodStock).values({
      periodId: period.id,
      honeyTypeId: typeId,
      quantityKg: item.quantityKg.toString(),
      costPerKg: item.costPerKg.toString()
    });
  }
  return { success: true, periodId: period.id };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
