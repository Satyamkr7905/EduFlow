export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[0-9][0-9 \-()]{6,18}$/;

export const validators = {
  required: (label) => (value) => (!value || !String(value).trim() ? `${label} is required` : ''),
  minLength: (label, min) => (value) =>
    value && String(value).trim().length < min ? `${label} must be at least ${min} characters` : '',
  maxLength: (label, max) => (value) =>
    value && String(value).trim().length > max ? `${label} must be under ${max} characters` : '',
  email: () => (value) => (value && !EMAIL_REGEX.test(value.trim()) ? 'Enter a valid email address' : ''),
  phone: () => (value) =>
    value && !PHONE_REGEX.test(value.trim()) ? 'Enter a valid phone number (7–15 digits)' : '',
};

/**
 * Run a map of field → [validator fns] and return a map of errors.
 */
export const runValidation = (values, rules) => {
  const errors = {};
  for (const [field, fns] of Object.entries(rules)) {
    for (const fn of fns) {
      const message = fn(values[field]);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
};
