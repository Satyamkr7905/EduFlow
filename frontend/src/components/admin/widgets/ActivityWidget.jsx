import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, PlusCircle, RefreshCcw } from 'lucide-react';
import { Card, CardHeader } from '../../ui/Card';
import { StatusBadge } from '../../ui/Badge';
import { EmptyState, Skeleton } from '../../ui/Feedback';
import { timeAgo } from '../../../utils/format';

export default function ActivityWidget({ items = [], loading }) {
  return (
    <Card className="h-full">
      <CardHeader
        title="Recent activity"
        subtitle="Latest changes across inquiries"
        action={
          <Link to="/admin/inquiries" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition hover:bg-cream" aria-label="Open inquiries">
            <ArrowUpRight size={16} />
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Activity} title="No activity yet" description="New submissions and status changes show up here." className="py-8" />
      ) : (
        <ol className="relative space-y-1">
          <span className="absolute bottom-3 left-[15px] top-3 w-px bg-line" aria-hidden="true" />
          {items.map((item, i) => {
            const created = item.type === 'created';
            const Icon = created ? PlusCircle : RefreshCcw;
            return (
              <motion.li
                key={`${item.id}-${item.at}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/admin/inquiries?open=${item.id}`}
                  className="relative flex items-start gap-3 rounded-2xl px-1 py-2 transition hover:bg-cream"
                >
                  <span
                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      created ? 'bg-lavender text-ink' : 'bg-sage text-ink'
                    }`}
                  >
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">
                      <span className="font-medium">{item.name}</span>{' '}
                      <span className="text-muted">{created ? 'submitted an inquiry' : 'was moved to'}</span>
                      {!created && (
                        <>
                          {' '}
                          <StatusBadge status={item.status} withDot={false} className="px-2 py-0 text-[10px]" />
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      {item.category} · {timeAgo(item.at)}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
