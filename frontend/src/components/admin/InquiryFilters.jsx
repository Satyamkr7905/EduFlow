import { AnimatePresence, motion } from 'framer-motion';
import { CalendarRange, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { CATEGORIES, STATUSES, USER_TYPES } from '../../utils/constants';
import { cn } from '../../utils/cn';

function PillSelect({ label, value, options, onChange, allLabel = 'All' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</span>
      <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
        {[{ value: '', label: allLabel }, ...options.map((o) => ({ value: o, label: o }))].map((opt) => {
          const active = (value || '') === opt.value;
          return (
            <button
              key={opt.value || 'all'}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition',
                active ? 'bg-ink text-white' : 'text-muted hover:bg-cream hover:text-ink'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * All filters are controlled and reflected in the URL by the parent,
 * so links like /admin/inquiries?status=New work out of the box.
 */
export default function InquiryFilters({ filters, onChange, onClear, activeCount, searchInput, onSearchInput }) {
  const set = (key) => (value) => onChange({ [key]: value });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => onSearchInput(e.target.value)}
            placeholder="Search by name or phone number…"
            className="field pl-11 pr-10"
            aria-label="Search inquiries"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-cream hover:text-ink"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5">
            <CalendarRange size={14} className="text-muted" />
            <input
              type="date"
              value={filters.from || ''}
              max={filters.to || undefined}
              onChange={(e) => set('from')(e.target.value)}
              className="w-[7.5rem] bg-transparent text-xs text-ink focus:outline-none"
              aria-label="From date"
            />
            <span className="text-xs text-muted">→</span>
            <input
              type="date"
              value={filters.to || ''}
              min={filters.from || undefined}
              onChange={(e) => set('to')(e.target.value)}
              className="w-[7.5rem] bg-transparent text-xs text-ink focus:outline-none"
              aria-label="To date"
            />
          </div>

          <AnimatePresence>
            {activeCount > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Button variant="subtle" size="sm" icon={X} onClick={onClear}>
                  Clear all ({activeCount})
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <PillSelect label="Status" value={filters.status} options={STATUSES} onChange={set('status')} />
        <PillSelect label="Category" value={filters.category} options={CATEGORIES} onChange={set('category')} />
        <PillSelect label="User type" value={filters.user_type} options={USER_TYPES} onChange={set('user_type')} />
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted">
        <SlidersHorizontal size={12} />
        Filters combine, and search runs on the server across every page.
      </p>
    </div>
  );
}
