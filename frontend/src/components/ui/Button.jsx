import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink/90 shadow-soft',
  coral: 'bg-coral text-white hover:bg-coral-dark shadow-soft',
  sage: 'bg-sage text-ink hover:bg-sage-dark/80',
  secondary: 'bg-white text-ink border border-line hover:bg-cream hover:border-ink/15',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  danger: 'bg-white text-coral-dark border border-coral/30 hover:bg-coral/10',
  subtle: 'bg-sand text-ink hover:bg-sand/70',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-xs gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
  icon: 'h-10 w-10 p-0',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className,
    icon: Icon,
    iconRight: IconRight,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={isDisabled}
      className={cn(
        'focus-ring inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : 16} />
      )}
      {children}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 14 : 16} />}
    </motion.button>
  );
});
