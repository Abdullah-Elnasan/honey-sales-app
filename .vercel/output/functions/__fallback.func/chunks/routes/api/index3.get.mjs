import { d as defineEventHandler } from '../../_/nitro.mjs';
import { d as db, h as honeyTypes } from '../../_/db.mjs';
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
  return db.select().from(honeyTypes);
});

export { index_get as default };
//# sourceMappingURL=index3.get.mjs.map
