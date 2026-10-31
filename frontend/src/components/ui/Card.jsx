import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const TONES = {
  white: 'bg-white border border-line',
  sand: 'bg-sand border border-transparent',
  sage: 'bg-sage border border-transparent',
  coral: 'bg-coral text-white border border-transparent',
  lavender: 'bg-lavender border border-transparent',
  dark: 'bg-ink text-white border border-transparent',
  cream: 'bg-cream border border-line',
};

export function Card({ children, tone = 'white', hover = false, className, padding = 'p-6', ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, boxShadow: '0 18px 40px -16px rgba(23,23,23,0.18)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn('relative rounded-xl3 shadow-soft', TONES[tone], padding, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn('mb-5 flex items-start justify-between gap-4', className)}>
      <div>
        <h3 className="font-heading text-base font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
