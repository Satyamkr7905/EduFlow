import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected error on idle client', err.message);
});

/**
 * Run a parameterized query.
 * @param {string} text  SQL with $1, $2 ... placeholders
 * @param {Array}  params
 */
export const query = (text, params = []) => pool.query(text, params);

export const checkConnection = async () => {
  const { rows } = await pool.query('SELECT NOW() AS now');
  return rows[0].now;
};

export const closePool = () => pool.end();
