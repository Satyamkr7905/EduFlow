const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDate = (value) => (value ? dateFormatter.format(new Date(value)) : '—');
export const formatDateTime = (value) => (value ? dateTimeFormatter.format(new Date(value)) : '—');

export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value ?? 0);

/** "3 minutes ago", "yesterday" … */
export const timeAgo = (value) => {
  if (!value) return '';
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(-Math.round(diff / seconds), unit);
  }
  return 'just now';
};

/** Short label for a chart bucket depending on its granularity. */
export const formatBucket = (bucket, unit) => {
  const d = new Date(bucket);
  if (unit === 'month') return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
  if (unit === 'week') return `Wk ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

export const toDateInputValue = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
