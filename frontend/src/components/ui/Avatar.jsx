import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

const TONES = ['bg-sage text-ink', 'bg-lavender text-ink', 'bg-coral text-white', 'bg-sand text-ink', 'bg-ink text-white'];

/** Deterministic pastel tone per name so the same person always looks the same. */
const toneFor = (name = '') => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return TONES[hash % TONES.length];
};

export function Avatar({ name, className, size = 'md', tone }) {
  const sizes = { sm: 'h-8 w-8 text-[11px]', md: 'h-10 w-10 text-xs', lg: 'h-14 w-14 text-base' };
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-heading font-semibold',
        sizes[size],
        tone || toneFor(name),
        className
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
