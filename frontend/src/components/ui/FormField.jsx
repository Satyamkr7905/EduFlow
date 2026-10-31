import { forwardRef, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

function FieldWrapper({ id, label, required, hint, error, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-ink">
          {label}
          {required && <span className="text-coral">*</span>}
        </label>
      )}
      {children}
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs font-medium text-coral-dark"
            role="alert"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted">
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export const Input = forwardRef(function Input(
  { label, required, hint, error, className, inputClassName, leftIcon: LeftIcon, rightElement, ...props },
  ref
) {
  const autoId = useId();
  const id = props.id || autoId;
  return (
    <FieldWrapper id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        {LeftIcon && (
          <LeftIcon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={cn('field', LeftIcon && 'pl-11', rightElement && 'pr-12', error && 'field-error', inputClassName)}
          {...props}
        />
        {rightElement && <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
    </FieldWrapper>
  );
});

export const Select = forwardRef(function Select(
  { label, required, hint, error, className, options = [], placeholder, ...props },
  ref
) {
  const autoId = useId();
  const id = props.id || autoId;
  return (
    <FieldWrapper id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={cn('field appearance-none pr-11', error && 'field-error', !props.value && 'text-muted')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value} className="text-ink">
                {text}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </FieldWrapper>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, required, hint, error, className, maxLength, value, ...props },
  ref
) {
  const autoId = useId();
  const id = props.id || autoId;
  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          value={value}
          maxLength={maxLength}
          aria-invalid={!!error}
          className={cn('field min-h-[140px] resize-y leading-relaxed', error && 'field-error')}
          {...props}
        />
        {maxLength && (
          <span className="pointer-events-none absolute bottom-3 right-4 text-[11px] text-muted">
            {String(value || '').length}/{maxLength}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
});
