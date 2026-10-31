import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOff, ChevronRight } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Skeleton } from '../ui/Feedback';
import { useAsync } from '../../hooks/useAsync';
import { inquiryService } from '../../services/inquiryService';
import { timeAgo } from '../../utils/format';

/** Lists the latest "New" inquiries – real data, no mock notifications. */
export default function NotificationsPanel({ onNavigate }) {
  const navigate = useNavigate();
  const fetcher = useCallback(() => inquiryService.list({ status: 'New', limit: 5 }), []);
  const { data, loading, error } = useAsync(fetcher, [fetcher]);

  const items = data?.inquiries || [];
  const total = data?.pagination?.total || 0;

  const open = (id) => {
    onNavigate?.();
    navigate(`/admin/inquiries?open=${id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-semibold text-ink">New inquiries</p>
        {total > 0 && <span className="pill bg-coral/15 text-coral-dark">{total} unread</span>}
      </div>
      <div className="my-1 h-px bg-line" />

      {loading ? (
        <div className="space-y-2 p-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : error ? (
        <p className="px-3 py-6 text-center text-sm text-muted">Couldn&apos;t load notifications.</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center px-3 py-8 text-center">
          <BellOff size={20} className="text-muted" />
          <p className="mt-2 text-sm font-medium text-ink">You&apos;re all caught up</p>
          <p className="text-xs text-muted">No new inquiries waiting.</p>
        </div>
      ) : (
        <ul className="max-h-80 space-y-1 overflow-y-auto">
          {items.map((inq) => (
            <li key={inq.id}>
              <button
                type="button"
                onClick={() => open(inq.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-cream"
              >
                <Avatar name={inq.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{inq.name}</p>
                  <p className="truncate text-xs text-muted">
                    {inq.category} · {inq.user_type} · {timeAgo(inq.created_at)}
                  </p>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="my-1 h-px bg-line" />
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          navigate('/admin/inquiries?status=New');
        }}
        className="w-full rounded-xl px-3 py-2.5 text-center text-sm font-medium text-ink transition hover:bg-cream"
      >
        View all new inquiries
      </button>
    </div>
  );
}
