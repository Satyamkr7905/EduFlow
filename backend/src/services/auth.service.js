import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from './token.service.js';

const BCRYPT_ROUNDS = 12;
// A fixed hash used to equalise response time when the email does not exist
// (mitigates user-enumeration via timing).
const DUMMY_HASH = bcrypt.hashSync('eduflow-timing-guard', BCRYPT_ROUNDS);

const PUBLIC_ADMIN_COLUMNS = 'id, name, email, created_at';

export const hashPassword = (plain) => bcrypt.hash(plain, BCRYPT_ROUNDS);

export const findAdminById = async (id) => {
  const { rows } = await query(`SELECT ${PUBLIC_ADMIN_COLUMNS} FROM admins WHERE id = $1`, [id]);
  return rows[0] || null;
};

export const login = async ({ email, password, rememberMe }) => {
  const { rows } = await query(
    `SELECT ${PUBLIC_ADMIN_COLUMNS}, password_hash FROM admins WHERE email = $1`,
    [email]
  );
  const admin = rows[0];

  const matches = await bcrypt.compare(password, admin ? admin.password_hash : DUMMY_HASH);
  if (!admin || !matches) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const { password_hash: _ignored, ...safeAdmin } = admin;
  const { token, expiresAt } = signToken(safeAdmin, { rememberMe });
  return { admin: safeAdmin, token, expiresAt };
};

export const changePassword = async (adminId, { currentPassword, newPassword }) => {
  const { rows } = await query('SELECT password_hash FROM admins WHERE id = $1', [adminId]);
  if (!rows[0]) throw ApiError.notFound('Admin not found.');

  const matches = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!matches) throw ApiError.badRequest('Current password is incorrect.', [
    { field: 'currentPassword', message: 'Current password is incorrect' },
  ]);

  const password_hash = await hashPassword(newPassword);
  await query('UPDATE admins SET password_hash = $1 WHERE id = $2', [password_hash, adminId]);
};

export const updateProfile = async (adminId, { name }) => {
  const { rows } = await query(
    `UPDATE admins SET name = $1 WHERE id = $2 RETURNING ${PUBLIC_ADMIN_COLUMNS}`,
    [name, adminId]
  );
  if (!rows[0]) throw ApiError.notFound('Admin not found.');
  return rows[0];
};

/**
 * Used by the seed script – creates the admin only if the email is not taken.
 */
export const createAdmin = async ({ name, email, password }) => {
  const password_hash = await hashPassword(password);
  const { rows } = await query(
    `INSERT INTO admins (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING
     RETURNING ${PUBLIC_ADMIN_COLUMNS}`,
    [name, email.toLowerCase(), password_hash]
  );
  return rows[0] || null;
};
