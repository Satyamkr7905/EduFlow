import { motion } from 'framer-motion';
import { Card } from '../../ui/Card';
import { Skeleton } from '../../ui/Feedback';
import { STATUSES } from '../../../utils/constants';

const BAR_TONES = {
  New: 'bg-lavender-dark',
  'In Progress': 'bg-coral',
  Resolved: 'bg-ink',
};

/**
 * Sage card inspired by the reference's "Opportunity" widget:
 * segmented progress bar + resolution rate.
 */
export default function StatusProgressWidget({ totals, resolutionRate = 0, loading }) {
  const total = totals?.total || 0;
  const segments = STATUSES.map((status) => {
    const key = status === 'In Progress' ? 'inProgress' : status.toLowerCase();
    const value = totals?.[key] || 0;
    return { status, value, pct: total ? Math.round((value / total) * 100) : 0 };
  });

  return (
    <Card tone="sage" className="flex h-full flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-ink">Inquiry status</h3>
          <p className="mt-0.5 text-sm text-ink/60">Pipeline for the selected period</p>
        </div>
        <span className="pill bg-white/70 text-ink">{total} total</span>
      </div>

      {loading ? (
        <Skeleton className="mt-6 h-24 bg-white/40" />
      ) : (
        <>
          <div className="mt-6">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/60">
              {segments.map((seg) =>
                seg.pct > 0 ? (
                  <motion.span
                    key={seg.status}
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${BAR_TONES[seg.status]}`}
                    title={`${seg.status}: ${seg.value}`}
                  />
                ) : null
              )}
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-2">
              {segments.map((seg) => (
                <li key={seg.status} className="rounded-2xl bg-white/60 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink/70">
                    <span className={`h-2 w-2 rounded-full ${BAR_TONES[seg.status]}`} />
                    {seg.status}
                  </div>
                  <p className="mt-1 font-heading text-lg font-semibold text-ink">{seg.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink/60">Resolution rate</p>
              <p className="font-heading text-3xl font-semibold text-ink">{resolutionRate}%</p>
            </div>
            <div className="flex items-end gap-1">
              {segments.map((seg) => (
                <motion.span
                  key={seg.status}
                  initial={{ height: 6 }}
                  animate={{ height: 6 + seg.pct * 0.4 }}
                  transition={{ duration: 0.8 }}
                  className={`w-2.5 rounded-full ${BAR_TONES[seg.status]}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
