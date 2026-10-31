import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Accessible modal / side-panel rendered in a portal.
 * variant: "center" (dialog) | "side" (right drawer)
 */
export function Modal({ open, onClose, title, description, children, variant = 'center', size = 'md', footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  const panelMotion =
    variant === 'side'
      ? {
          initial: { x: '100%', opacity: 0.6 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100%', opacity: 0.6 },
          transition: { type: 'spring', stiffness: 320, damping: 34 },
        }
      : {
          initial: { opacity: 0, y: 24, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 12, scale: 0.98 },
          transition: { type: 'spring', stiffness: 380, damping: 32 },
        };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            'fixed inset-0 z-[90] flex',
            variant === 'side' ? 'justify-end' : 'items-end justify-center p-4 sm:items-center'
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            {...panelMotion}
            className={cn(
              'relative flex w-full flex-col bg-white shadow-panel',
              variant === 'side'
                ? 'h-full max-w-xl rounded-l-xl4 sm:my-3 sm:mr-3 sm:h-[calc(100%-1.5rem)] sm:rounded-xl4'
                : cn('max-h-[90vh] rounded-xl4', sizes[size])
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                {title && <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>}
                {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="focus-ring -mr-2 -mt-1 rounded-full p-2 text-muted transition hover:bg-cream hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="border-t border-line px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
