import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { DATE_RANGE_OPTIONS } from '../../utils/constants';
import { cn } from '../../utils/cn';

/** Pill-shaped segmented control for the dashboard date range. */
export default function RangeSelector({ value, onChange, id = 'range' }) {
  return (
    <div className="flex items-center gap-2">
      <CalendarDays size={16} className="hidden text-muted sm:block" />
      <div className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full border border-line bg-white p-1 shadow-soft">
        {DATE_RANGE_OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                active ? 'text-white' : 'text-muted hover:text-ink'
              )}
              aria-pressed={active}
            >
              {active && (
                <motion.span
                  layoutId={`range-pill-${id}`}
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
