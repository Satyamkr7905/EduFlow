import { query } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const COLUMNS =
  'id, name, email, phone, user_type, category, message, status, created_at, updated_at';

/**
 * Build a parameterized WHERE clause from list filters.
 * Returns { where: string, params: any[] }
 */
const buildFilters = ({ search, category, user_type, status, from, to }) => {
  const clauses = [];
  const params = [];
  const add = (sqlFragment, value) => {
    params.push(value);
    clauses.push(sqlFragment.replace('?', `$${params.length}`));
  };

  if (search) {
    // Match on name (case-insensitive) OR phone (digits only, partial match)
    const digits = search.replace(/\D/g, '');
    params.push(`%${search.toLowerCase()}%`);
    const nameParam = `$${params.length}`;
    if (digits.length > 0) {
      params.push(`%${digits}%`);
      const phoneParam = `$${params.length}`;
      clauses.push(
        `(lower(name) LIKE ${nameParam} OR regexp_replace(phone, '\\D', '', 'g') LIKE ${phoneParam})`
      );
    } else {
      clauses.push(`lower(name) LIKE ${nameParam}`);
    }
  }
  if (category) add('category = ?', category);
  if (user_type) add('user_type = ?', user_type);
  if (status) add('status = ?', status);
  if (from) add('created_at >= ?::date', from);
  if (to) add("created_at < (?::date + INTERVAL '1 day')", to);

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
};

export const createInquiry = async (payload) => {
  const { name, email, phone, user_type, category, message } = payload;
  const { rows } = await query(
    `INSERT INTO inquiries (name, email, phone, user_type, category, message)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${COLUMNS}`,
    [name, email, phone, user_type, category, message]
  );
  return rows[0];
};

export const listInquiries = async (filters) => {
  const { page, limit, sort, order } = filters;
  const { where, params } = buildFilters(filters);
  const offset = (page - 1) * limit;

  // sort/order are validated against a whitelist so interpolation is safe.
  const orderBy = `ORDER BY ${sort} ${order.toUpperCase()}, id ${order.toUpperCase()}`;

  const [countResult, rowsResult] = await Promise.all([
    query(`SELECT COUNT(*)::int AS total FROM inquiries ${where}`, params),
    query(
      `SELECT ${COLUMNS} FROM inquiries ${where} ${orderBy}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    ),
  ]);

  const total = countResult.rows[0].total;
  return {
    items: rowsResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export const getInquiryById = async (id) => {
  const { rows } = await query(`SELECT ${COLUMNS} FROM inquiries WHERE id = $1`, [id]);
  if (!rows[0]) throw ApiError.notFound('Inquiry not found.');
  return rows[0];
};

export const updateInquiryStatus = async (id, status) => {
  const { rows } = await query(
    `UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING ${COLUMNS}`,
    [status, id]
  );
  if (!rows[0]) throw ApiError.notFound('Inquiry not found.');
  return rows[0];
};

export const deleteInquiry = async (id) => {
  const { rowCount } = await query('DELETE FROM inquiries WHERE id = $1', [id]);
  if (rowCount === 0) throw ApiError.notFound('Inquiry not found.');
};
