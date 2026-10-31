import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Skeleton } from '../../ui/Feedback';
import { CATEGORIES, CATEGORY_COLORS } from '../../../utils/constants';

/**
 * Beige card inspired by the reference's "Task Update" widget –
 * tall rounded pills whose height encodes share per category.
 */
export default function CategoryWidget({ byCategory = [], loading }) {
  const map = Object.fromEntries(byCategory.map((c) => [c.name, c.value]));
  const total = CATEGORIES.reduce((s, c) => s + (map[c] || 0), 0);
  const max = Math.max(1, ...CATEGORIES.map((c) => map[c] || 0));

  return (
    <Card tone="sand" className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-ink">By category</h3>
          <p className="mt-0.5 text-sm text-ink/60">Where inquiries come from</p>
        </div>
        <span className="pill bg-white/70 text-ink">{total}</span>
      </div>

      {loading ? (
        <Skeleton className="mt-6 h-36 bg-white/50" />
      ) : (
        <div className="mt-6 flex flex-1 items-end justify-between gap-3">
          {CATEGORIES.map((cat, i) => {
            const value = map[cat] || 0;
            const pct = total ? Math.round((value / total) * 100) : 0;
            const heightPct = 28 + (value / max) * 72;
            return (
              <Link
                key={cat}
                to={`/admin/inquiries?category=${encodeURIComponent(cat)}`}
                className="group flex flex-1 flex-col items-center gap-2"
                title={`${cat}: ${value}`}
              >
                <span className="text-[11px] font-medium text-ink/70">{pct}%</span>
                <div className="flex h-28 w-full items-end justify-center">
                  <motion.div
                    initial={{ height: '20%' }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="flex w-full max-w-[52px] items-end justify-center rounded-full pb-2 shadow-soft transition-transform group-hover:-translate-y-1"
                    style={{ background: cat === 'General Query' ? '#171717' : CATEGORY_COLORS[cat] }}
                  >
                    <span className={`font-heading text-sm font-semibold ${cat === 'General Query' || cat === 'Concert' ? 'text-white' : 'text-ink'}`}>
                      {value}
                    </span>
                  </motion.div>
                </div>
                <span className="text-center text-[11px] leading-tight text-ink/70">{cat === 'General Query' ? 'General' : cat}</span>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
