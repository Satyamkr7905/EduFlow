/**
 * Applies database/schema.sql to the database in DATABASE_URL.
 * Usage:  npm run db:init   (from /backend)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, closePool } from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

const run = async () => {
  const sql = await fs.readFile(schemaPath, 'utf8');
  console.log(`[db:init] Applying ${path.relative(process.cwd(), schemaPath)} ...`);
  await pool.query(sql);
  console.log('[db:init] Schema applied successfully.');
};

run()
  .catch((err) => {
    console.error('[db:init] Failed:', err.message);
    process.exitCode = 1;
  })
  .finally(closePool);
