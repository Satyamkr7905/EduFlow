import { cn } from '../../utils/cn';
import { STATUS_STYLES } from '../../utils/constants';

export function Badge({ children, className, tone = 'sand' }) {
  const tones = {
    sand: 'bg-sand text-ink',
    sage: 'bg-sage/70 text-ink',
    coral: 'bg-coral/20 text-coral-dark',
    lavender: 'bg-lavender/70 text-ink',
    dark: 'bg-ink text-white',
    outline: 'border border-line text-muted',
  };
  return <span className={cn('pill', tones[tone], className)}>{children}</span>;
}

export function StatusBadge({ status, className, withDot = true }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.New;
  return (
    <span className={cn('pill', style.bg, style.text, className)}>
      {withDot && <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />}
      {status}
    </span>
  );
}
