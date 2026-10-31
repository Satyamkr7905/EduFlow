import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Inbox, Trash2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { EmptyState, ErrorState, Skeleton } from '../ui/Feedback';
import StatusSelect from './StatusSelect';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';

const CATEGORY_TONES = {
  Scholarship: 'sage',
  Concert: 'coral',
  Admission: 'lavender',
  'General Query': 'sand',
};

/**
 * Inquiry list: a real <table> on desktop, stacked cards on small screens.
 * Status changes & deletes are delegated to the parent so both the dashboard
 * and the inquiries page share this component.
 */
export default function InquiryTable({
  inquiries = [],
  loading = false,
  error = null,
  onRetry,
  onView,
  onStatusChange,
  onDelete,
  updatingId = null,
  compact = false,
  emptyTitle = 'No inquiries found',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyAction,
}) {
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />;

  if (loading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: compact ? 5 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );
  }

  if (!inquiries.length) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[880px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-xs font-medium text-muted">
              <th className="px-4 pb-3 pt-1 font-medium">Name</th>
              <th className="px-4 pb-3 pt-1 font-medium">Phone</th>
              <th className="px-4 pb-3 pt-1 font-medium">Email</th>
              <th className="px-4 pb-3 pt-1 font-medium">User type</th>
              <th className="px-4 pb-3 pt-1 font-medium">Category</th>
              <th className="px-4 pb-3 pt-1 font-medium">Date</th>
              <th className="px-4 pb-3 pt-1 font-medium">Status</th>
              <th className="px-4 pb-3 pt-1 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {inquiries.map((inq) => (
                <motion.tr
                  key={inq.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onView?.(inq)}
                  className="group cursor-pointer"
                >
                  <td className="rounded-l-2xl border-y border-l border-transparent px-4 py-3 transition group-hover:border-line group-hover:bg-cream">
                    <div className="flex items-center gap-3">
                      <Avatar name={inq.name} size="sm" />
                      <span className="font-medium text-ink">{inq.name}</span>
                    </div>
                  </td>
                  <td className="border-y border-transparent px-4 py-3 text-ink/80 transition group-hover:border-line group-hover:bg-cream">
                    {inq.phone}
                  </td>
                  <td className="max-w-[200px] truncate border-y border-transparent px-4 py-3 text-ink/80 transition group-hover:border-line group-hover:bg-cream">
                    {inq.email}
                  </td>
                  <td className="border-y border-transparent px-4 py-3 transition group-hover:border-line group-hover:bg-cream">
                    <Badge tone="outline">{inq.user_type}</Badge>
                  </td>
                  <td className="border-y border-transparent px-4 py-3 transition group-hover:border-line group-hover:bg-cream">
                    <Badge tone={CATEGORY_TONES[inq.category]}>{inq.category}</Badge>
                  </td>
                  <td className="whitespace-nowrap border-y border-transparent px-4 py-3 text-muted transition group-hover:border-line group-hover:bg-cream">
                    {formatDate(inq.created_at)}
                  </td>
                  <td className="border-y border-transparent px-4 py-3 transition group-hover:border-line group-hover:bg-cream">
                    <StatusSelect
                      value={inq.status}
                      loading={updatingId === inq.id}
                      onChange={(status) => onStatusChange?.(inq, status)}
                    />
                  </td>
                  <td className="rounded-r-2xl border-y border-r border-transparent px-4 py-3 transition group-hover:border-line group-hover:bg-cream">
                    <div className="flex items-center justify-end gap-1">
                      <RowAction label="View details" icon={Eye} onClick={() => onView?.(inq)} />
                      {onDelete && (
                        <RowAction label="Delete inquiry" icon={Trash2} danger onClick={() => onDelete(inq)} />
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        <AnimatePresence initial={false}>
          {inquiries.map((inq) => (
            <motion.li
              key={inq.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="rounded-xl3 border border-line bg-white p-4"
            >
              <button type="button" onClick={() => onView?.(inq)} className="flex w-full items-start gap-3 text-left">
                <Avatar name={inq.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{inq.name}</p>
                  <p className="truncate text-xs text-muted">{inq.email}</p>
                  <p className="text-xs text-muted">{inq.phone}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-muted">{formatDate(inq.created_at)}</span>
              </button>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="outline">{inq.user_type}</Badge>
                <Badge tone={CATEGORY_TONES[inq.category]}>{inq.category}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <StatusSelect
                  align="left"
                  value={inq.status}
                  loading={updatingId === inq.id}
                  onChange={(status) => onStatusChange?.(inq, status)}
                />
                <div className="flex items-center gap-1">
                  <RowAction label="View details" icon={Eye} onClick={() => onView?.(inq)} />
                  {onDelete && <RowAction label="Delete inquiry" icon={Trash2} danger onClick={() => onDelete(inq)} />}
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}

function RowAction({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'focus-ring flex h-8 w-8 items-center justify-center rounded-full text-muted transition',
        danger ? 'hover:bg-coral/15 hover:text-coral-dark' : 'hover:bg-white hover:text-ink'
      )}
      aria-label={label}
      title={label}
    >
      <Icon size={15} />
    </button>
  );
}
