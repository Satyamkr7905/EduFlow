import { motion } from 'framer-motion';
import { Inbox, Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function Spinner({ className, size = 20 }) {
  return <Loader2 size={size} className={cn('animate-spin text-muted', className)} />;
}

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sand text-muted">
        <Icon size={24} />
      </div>
      <h3 className="font-heading text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry, className }) {
  return (
    <EmptyState
      icon={WifiOff}
      title="Couldn't load data"
      description={message}
      className={className}
      action={
        onRetry && (
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted">
      <Spinner size={24} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
