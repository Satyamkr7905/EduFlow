import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { APP_NAME } from '../../utils/constants';

export function LogoMark({ className, size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="18" fill="#171717" />
      <path d="M32 14 L46 26 L32 38 L18 26 Z" fill="#BFD7D0" />
      <circle cx="32" cy="46" r="5" fill="#E47758" />
    </svg>
  );
}

export function Logo({ to = '/', className, light = false, size = 36, hideText = false }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2.5', className)} aria-label={`${APP_NAME} home`}>
      <LogoMark size={size} />
      {!hideText && (
        <span className={cn('font-heading text-lg font-semibold tracking-tight', light ? 'text-white' : 'text-ink')}>
          {APP_NAME}
        </span>
      )}
    </Link>
  );
}
