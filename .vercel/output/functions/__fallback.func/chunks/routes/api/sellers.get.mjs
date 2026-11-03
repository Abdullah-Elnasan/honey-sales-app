import { d as defineEventHandler } from '../../_/nitro.mjs';
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

const sellers_get = defineEventHandler(async () => {
  const result = await db.selectDistinct({ sellerName: sales.sellerName }).from(sales);
  return result.map((r) => r.sellerName);
});

export { sellers_get as default };
//# sourceMappingURL=sellers.get.mjs.map
