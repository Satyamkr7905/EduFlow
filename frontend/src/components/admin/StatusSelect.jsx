import { Check, ChevronDown } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { StatusBadge } from '../ui/Badge';
import { Spinner } from '../ui/Feedback';
import { STATUSES, STATUS_STYLES } from '../../utils/constants';
import { cn } from '../../utils/cn';

/** Pill-shaped status picker used in table rows and the detail panel. */
export default function StatusSelect({ value, onChange, loading = false, size = 'sm', align = 'right' }) {
  return (
    <Dropdown
      align={align}
      width="w-44"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          disabled={loading}
          className={cn(
            'focus-ring group inline-flex items-center gap-1 rounded-full transition',
            loading && 'opacity-70'
          )}
          aria-label="Change status"
        >
          {loading ? (
            <span className="pill bg-sand text-muted">
              <Spinner size={12} /> Updating…
            </span>
          ) : (
            <StatusBadge status={value} className={size === 'md' ? 'px-3.5 py-1.5 text-sm' : ''} />
          )}
          <ChevronDown size={14} className={cn('text-muted transition-transform', open && 'rotate-180')} />
        </button>
      )}
    >
      {({ close }) => (
        <ul onClick={(e) => e.stopPropagation()}>
          {STATUSES.map((status) => {
            const style = STATUS_STYLES[status];
            const active = status === value;
            return (
              <li key={status}>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    if (!active) onChange(status);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition hover:bg-cream',
                    active ? 'font-semibold text-ink' : 'text-ink/80'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', style.dot)} />
                  <span className="flex-1 text-left">{status}</span>
                  {active && <Check size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Dropdown>
  );
}
