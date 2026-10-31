/**
 * Creates the first admin account.
 *
 * Credentials are read from environment variables (or CLI flags) so nothing
 * sensitive is ever committed to the repository:
 *
 *   SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD   (backend/.env)
 *
 * or
 *
 *   node scripts/seedAdmin.js --name "Jane Doe" --email jane@school.edu --password "S3cure!Pass"
 *
 * The script is idempotent: if an admin with that email already exists it exits
 * without changing anything.
 */
import '../src/config/env.js';
import { closePool } from '../src/config/db.js';
import { createAdmin } from '../src/services/auth.service.js';

const argValue = (flag) => {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
};

const name = argValue('--name') || process.env.SEED_ADMIN_NAME || 'EduFlow Admin';
const email = argValue('--email') || process.env.SEED_ADMIN_EMAIL;
const password = argValue('--password') || process.env.SEED_ADMIN_PASSWORD;

const fail = (message) => {
  console.error(`[seed:admin] ${message}`);
  process.exit(1);
};

if (!email || !password) {
  fail('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set (env or --email/--password flags).');
}
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail('SEED_ADMIN_EMAIL is not a valid email.');
if (password.length < 8) fail('SEED_ADMIN_PASSWORD must be at least 8 characters.');

const run = async () => {
  const admin = await createAdmin({ name, email, password });
  if (!admin) {
    console.log(`[seed:admin] An admin with email "${email}" already exists – nothing to do.`);
    return;
  }
  console.log('[seed:admin] Admin created:');
  console.log(`             name:  ${admin.name}`);
  console.log(`             email: ${admin.email}`);
  console.log('             You can now sign in at /admin/login.');
};

run()
  .catch((err) => {
    console.error('[seed:admin] Failed:', err.message);
    process.exitCode = 1;
  })
  .finally(closePool);
