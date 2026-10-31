import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Mail, Phone, Send, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/FormField';
import { useToast } from '../../context/ToastContext';
import { inquiryService } from '../../services/inquiryService';
import { CATEGORIES, USER_TYPES } from '../../utils/constants';
import { runValidation, validators as v } from '../../utils/validation';

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  user_type: '',
  category: '',
  message: '',
};

const RULES = {
  name: [v.required('Full name'), v.minLength('Name', 2), v.maxLength('Name', 120)],
  email: [v.required('Email'), v.email()],
  phone: [v.required('Phone number'), v.phone()],
  user_type: [v.required('User type')],
  category: [v.required('Inquiry category')],
  message: [v.required('Message'), v.minLength('Message', 10), v.maxLength('Message', 2000)],
};

export default function InquiryForm({ defaultCategory = '' }) {
  const toast = useToast();
  const [values, setValues] = useState({
    ...INITIAL,
    category: CATEGORIES.includes(defaultCategory) ? defaultCategory : '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const setField = (field) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldErrors = runValidation({ [field]: value }, { [field]: RULES[field] });
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || '' }));
    }
  };

  const onBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = runValidation({ [field]: values[field] }, { [field]: RULES[field] });
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = runValidation(values, RULES);
    setErrors(validation);
    setTouched(Object.fromEntries(Object.keys(RULES).map((k) => [k, true])));
    if (Object.keys(validation).length) {
      const first = document.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await inquiryService.submit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
      });
      setSuccess({ name: values.name.trim(), id: res.data.inquiry.id });
      toast.success(res.message || 'Inquiry submitted successfully');
      setValues(INITIAL);
      setTouched({});
      setErrors({});
    } catch (err) {
      // Map backend validation errors onto fields when present
      if (err.errors?.length) {
        const mapped = {};
        for (const item of err.errors) mapped[item.field] = item.message;
        setErrors((prev) => ({ ...prev, ...mapped }));
      }
      toast.error(err.message || 'We could not submit your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-sage text-ink"
            >
              <CheckCircle2 size={36} />
            </motion.div>
            <h3 className="mt-6 font-heading text-2xl font-semibold text-ink">Thank you, {success.name.split(' ')[0]}!</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Your inquiry has been received and is now with our team. We&apos;ll reply to the email
              address you provided within one working day.
            </p>
            <p className="mt-4 rounded-full bg-cream px-3 py-1 font-mono text-[11px] text-muted">
              Ref: {success.id.slice(0, 8).toUpperCase()}
            </p>
            <Button variant="secondary" className="mt-8" onClick={() => setSuccess(null)}>
              Submit another inquiry
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                required
                placeholder="Priya Sharma"
                leftIcon={User}
                value={values.name}
                onChange={setField('name')}
                onBlur={onBlur('name')}
                error={touched.name && errors.name}
                autoComplete="name"
                disabled={submitting}
              />
              <Input
                label="Email address"
                required
                type="email"
                placeholder="you@example.com"
                leftIcon={Mail}
                value={values.email}
                onChange={setField('email')}
                onBlur={onBlur('email')}
                error={touched.email && errors.email}
                autoComplete="email"
                disabled={submitting}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Phone number"
                required
                type="tel"
                placeholder="+91 98765 43210"
                leftIcon={Phone}
                value={values.phone}
                onChange={setField('phone')}
                onBlur={onBlur('phone')}
                error={touched.phone && errors.phone}
                autoComplete="tel"
                disabled={submitting}
              />
              <Select
                label="I am a"
                required
                placeholder="Select user type"
                options={USER_TYPES}
                value={values.user_type}
                onChange={setField('user_type')}
                onBlur={onBlur('user_type')}
                error={touched.user_type && errors.user_type}
                disabled={submitting}
              />
            </div>

            <Select
              label="Inquiry category"
              required
              placeholder="What is this about?"
              options={CATEGORIES}
              value={values.category}
              onChange={setField('category')}
              onBlur={onBlur('category')}
              error={touched.category && errors.category}
              disabled={submitting}
            />

            <Textarea
              label="Message"
              required
              placeholder="Tell us a little about what you're looking for…"
              value={values.message}
              onChange={setField('message')}
              onBlur={onBlur('message')}
              error={touched.message && errors.message}
              maxLength={2000}
              hint="Minimum 10 characters."
              disabled={submitting}
            />

            <div className="flex flex-col-reverse items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted">
                By submitting you agree to be contacted about your inquiry.
                <br className="hidden sm:block" /> Fields marked <span className="text-coral">*</span> are
                required.
              </p>
              <Button type="submit" size="lg" loading={submitting} icon={Send} className="w-full sm:w-auto">
                {submitting ? 'Sending…' : 'Send inquiry'}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
