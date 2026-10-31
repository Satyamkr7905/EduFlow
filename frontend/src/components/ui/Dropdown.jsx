import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickOutside } from '../../hooks/useClickOutside';
import { cn } from '../../utils/cn';

/**
 * Generic popover anchored to a trigger. `trigger` receives { open, toggle }.
 */
export function Dropdown({ trigger, children, align = 'right', width = 'w-64', className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o), close })}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={cn(
              'absolute z-50 mt-2 origin-top rounded-xl3 border border-line bg-white p-2 shadow-lift',
              align === 'right' ? 'right-0' : 'left-0',
              width,
              className
            )}
          >
            {typeof children === 'function' ? children({ close }) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, onClick, danger = false, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
        danger ? 'text-coral-dark hover:bg-coral/10' : 'text-ink hover:bg-cream',
        className
      )}
    >
      {Icon && <Icon size={16} className={danger ? 'text-coral-dark' : 'text-muted'} />}
      {children}
    </button>
  );
}
