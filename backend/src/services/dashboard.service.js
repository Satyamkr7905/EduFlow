import { query } from '../config/db.js';
import { DATE_RANGES } from '../utils/constants.js';

/**
 * Bucketing strategy per range. `unit` values are whitelisted below and
 * only ever interpolated from this table – never from user input.
 */
const BUCKETS = {
  '7d': { unit: 'day', span: '6 days' },
  '30d': { unit: 'day', span: '29 days' },
  '90d': { unit: 'week', span: '12 weeks' },
  all: { unit: 'month', span: '11 months' },
};
const ALLOWED_UNITS = new Set(['day', 'week', 'month']);

const rangeClause = (range) => {
  const days = DATE_RANGES[range];
  return days ? `created_at >= NOW() - INTERVAL '${days} days'` : 'TRUE';
};

const previousRangeClause = (range) => {
  const days = DATE_RANGES[range];
  return days
    ? `created_at >= NOW() - INTERVAL '${days * 2} days' AND created_at < NOW() - INTERVAL '${days} days'`
    : null;
};

const percentChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
};

const statusCounts = async (whereClause) => {
  const { rows } = await query(
    `SELECT
       COUNT(*)::int                                            AS total,
       COUNT(*) FILTER (WHERE status = 'New')::int              AS new,
       COUNT(*) FILTER (WHERE status = 'In Progress')::int      AS in_progress,
       COUNT(*) FILTER (WHERE status = 'Resolved')::int         AS resolved
     FROM inquiries WHERE ${whereClause}`
  );
  const r = rows[0];
  return { total: r.total, new: r.new, inProgress: r.in_progress, resolved: r.resolved };
};

const trendSeries = async (range) => {
  const { unit, span } = BUCKETS[range];
  if (!ALLOWED_UNITS.has(unit)) throw new Error('Invalid bucket unit');

  const { rows } = await query(
    `WITH buckets AS (
       SELECT generate_series(
         date_trunc('${unit}', NOW() - INTERVAL '${span}'),
         date_trunc('${unit}', NOW()),
         INTERVAL '1 ${unit}'
       ) AS bucket
     )
     SELECT
       b.bucket,
       COUNT(i.id)::int                                        AS total,
       COUNT(i.id) FILTER (WHERE i.status = 'New')::int         AS new,
       COUNT(i.id) FILTER (WHERE i.status = 'In Progress')::int AS in_progress,
       COUNT(i.id) FILTER (WHERE i.status = 'Resolved')::int    AS resolved
     FROM buckets b
     LEFT JOIN inquiries i ON date_trunc('${unit}', i.created_at) = b.bucket
     GROUP BY b.bucket
     ORDER BY b.bucket`
  );

  return rows.map((r) => ({
    bucket: r.bucket,
    unit,
    total: r.total,
    new: r.new,
    inProgress: r.in_progress,
    resolved: r.resolved,
  }));
};

export const getStats = async (range) => {
  const current = await statusCounts(rangeClause(range));
  const prevClause = previousRangeClause(range);
  const previous = prevClause ? await statusCounts(prevClause) : null;
  const trend = await trendSeries(range);

  const changes = previous
    ? {
        total: percentChange(current.total, previous.total),
        new: percentChange(current.new, previous.new),
        inProgress: percentChange(current.inProgress, previous.inProgress),
        resolved: percentChange(current.resolved, previous.resolved),
      }
    : { total: null, new: null, inProgress: null, resolved: null };

  const pick = (key) => trend.map((t) => t[key]);

  return {
    range,
    totals: current,
    changes,
    sparklines: {
      total: pick('total'),
      new: pick('new'),
      inProgress: pick('inProgress'),
      resolved: pick('resolved'),
    },
    resolutionRate: current.total ? Math.round((current.resolved / current.total) * 100) : 0,
  };
};

export const getAnalytics = async (range) => {
  const where = rangeClause(range);

  const [trend, byCategory, byUserType, byStatus, activity] = await Promise.all([
    trendSeries(range),
    query(
      `SELECT category AS name, COUNT(*)::int AS value
       FROM inquiries WHERE ${where} GROUP BY category ORDER BY value DESC`
    ),
    query(
      `SELECT user_type AS name, COUNT(*)::int AS value
       FROM inquiries WHERE ${where} GROUP BY user_type ORDER BY value DESC`
    ),
    query(
      `SELECT status AS name, COUNT(*)::int AS value
       FROM inquiries WHERE ${where} GROUP BY status
       ORDER BY array_position(ARRAY['New','In Progress','Resolved'], status)`
    ),
    query(
      `SELECT id, name, category, user_type, status, created_at, updated_at,
              (updated_at - created_at) < INTERVAL '2 seconds' AS is_new
       FROM inquiries
       ORDER BY updated_at DESC
       LIMIT 8`
    ),
  ]);

  return {
    range,
    trend,
    byCategory: byCategory.rows,
    byUserType: byUserType.rows,
    byStatus: byStatus.rows,
    recentActivity: activity.rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      userType: row.user_type,
      status: row.status,
      type: row.is_new ? 'created' : 'status_updated',
      at: row.updated_at,
    })),
  };
};
