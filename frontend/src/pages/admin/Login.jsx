import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormField';
import { Logo, LogoMark } from '../../components/ui/Logo';
import { PageTransition, fadeUp, stagger } from '../../components/ui/Motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { APP_NAME } from '../../utils/constants';
import { runValidation, validators as v } from '../../utils/validation';

const RULES = {
  email: [v.required('Email'), v.email()],
  password: [v.required('Password')],
};

const DOTS = Array.from({ length: 48 });

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin';

  const [values, setValues] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = runValidation(values, RULES);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setLoading(true);
    setFormError('');
    try {
      const admin = await login(values);
      toast.success(`Welcome back, ${admin.name.split(' ')[0]}`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-cream lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex"
      >
        <div className="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute -left-10 bottom-10 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />

        <Logo light />

        <div className="relative">
          <motion.div variants={stagger(0.1)} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-sm font-medium text-sage">
              Admin workspace
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-4 max-w-md font-heading text-4xl font-semibold leading-tight">
              Every inquiry, answered with care.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-md text-white/60">
              Track admissions, scholarships and event requests from parents, students and schools
              in one calm, focused dashboard.
            </motion.p>
          </motion.div>

          <div className="mt-12 grid grid-cols-12 gap-2.5">
            {DOTS.map((_, i) => {
              const tones = ['bg-sage', 'bg-lavender', 'bg-coral', 'bg-white/15'];
              const tone = tones[(i * 7) % 4];
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.015, type: 'spring', stiffness: 260, damping: 20 }}
                  className={`h-5 w-5 rounded-full ${tone}`}
                />
              );
            })}
          </div>
        </div>

        <p className="text-xs text-white/40">Secured with JWT · Passwords hashed with bcrypt</p>
      </motion.aside>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-8 lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink">
            <ArrowLeft size={14} /> Back to website
          </Link>

          <div className="rounded-xl4 border border-line bg-white p-7 shadow-lift sm:p-9">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <LogoMark size={40} />
              <span className="font-heading text-lg font-semibold">{APP_NAME}</span>
            </div>

            <h2 className="font-heading text-2xl font-semibold text-ink">Sign in</h2>
            <p className="mt-1 text-sm text-muted">Use your administrator credentials to continue.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="satyamkumar9250@gmail.com"
                leftIcon={Mail}
                value={values.email}
                onChange={onChange('email')}
                error={errors.email}
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={Lock}
                value={values.password}
                onChange={onChange('password')}
                error={errors.password}
                autoComplete="current-password"
                disabled={loading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="focus-ring rounded-full p-2 text-muted transition hover:text-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={values.rememberMe}
                  onChange={onChange('rememberMe')}
                  className="h-4 w-4 rounded border-line accent-ink"
                />
                Keep me signed in for 30 days
              </label>

              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="rounded-2xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral-dark"
                >
                  {formError}
                </motion.div>
              )}

              <Button type="submit" size="lg" className="w-full" loading={loading} icon={LogIn}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Access is restricted to {APP_NAME} administrators.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
