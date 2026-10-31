import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, LogOut, Save, ShieldCheck, UserRound } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormField';
import { Avatar } from '../../components/ui/Avatar';
import { PageTransition } from '../../components/ui/Motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import { API_URL } from '../../services/api';
import { formatDate } from '../../utils/format';
import { runValidation, validators as v } from '../../utils/validation';

function PasswordInput({ label, value, onChange, error, autoComplete, disabled, hint }) {
  const [show, setShow] = useState(false);
  return (
    <Input
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={error}
      hint={hint}
      autoComplete={autoComplete}
      disabled={disabled}
      rightElement={
        <button type="button" onClick={() => setShow((s) => !s)} className="focus-ring rounded-full p-2 text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

export default function Settings() {
  const { admin, updateAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Profile
  const [name, setName] = useState(admin?.name || '');
  const [nameError, setNameError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    const errors = runValidation({ name }, { name: [v.required('Name'), v.minLength('Name', 2), v.maxLength('Name', 120)] });
    setNameError(errors.name || '');
    if (errors.name) return;
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({ name: name.trim() });
      updateAdmin(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // Password
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const setPwField = (field) => (e) => {
    setPw((prev) => ({ ...prev, [field]: e.target.value }));
    setPwErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const errors = runValidation(pw, {
      currentPassword: [v.required('Current password')],
      newPassword: [v.required('New password'), v.minLength('New password', 8)],
      confirm: [v.required('Confirmation')],
    });
    if (!errors.newPassword && !/[A-Za-z]/.test(pw.newPassword)) errors.newPassword = 'Password must contain a letter';
    if (!errors.newPassword && !/[0-9]/.test(pw.newPassword)) errors.newPassword = 'Password must contain a number';
    if (!errors.confirm && pw.confirm !== pw.newPassword) errors.confirm = 'Passwords do not match';
    if (!errors.newPassword && pw.newPassword === pw.currentPassword) errors.newPassword = 'Choose a different password';
    setPwErrors(errors);
    if (Object.keys(errors).length) return;

    setSavingPw(true);
    try {
      const message = await authService.changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success(message || 'Password updated');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      if (err.errors?.length) {
        setPwErrors(Object.fromEntries(err.errors.map((i) => [i.field, i.message])));
      }
      toast.error(err.message);
    } finally {
      setSavingPw(false);
    }
  };

  const signOut = () => {
    logout();
    toast.info('Signed out');
    navigate('/admin/login', { replace: true });
  };

  return (
    <PageTransition>
      <PageHeader title="Settings" subtitle="Manage your administrator profile and account security." />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        {/* Profile summary */}
        <div className="space-y-4">
          <Card tone="dark" className="flex flex-col items-start">
            <Avatar name={admin?.name} size="lg" tone="bg-sage text-ink" />
            <h2 className="mt-4 font-heading text-xl font-semibold">{admin?.name}</h2>
            <p className="text-sm text-white/60">{admin?.email}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="pill bg-white/10 text-white">Administrator</span>
              <span className="pill bg-white/10 text-white">Joined {formatDate(admin?.created_at)}</span>
            </div>
          </Card>

          <Card tone="sage">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-ink">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-ink">Security</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">
                  Sessions use signed JWTs that expire automatically. Passwords are hashed with bcrypt and never
                  stored in plain text.
                </p>
                <p className="mt-3 break-all font-mono text-[11px] text-ink/60">API · {API_URL}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Session" subtitle="Sign out of this device" />
            <Button variant="danger" icon={LogOut} onClick={signOut}>
              Sign out
            </Button>
          </Card>
        </div>

        {/* Forms */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Profile" subtitle="How your name appears across the dashboard" />
            <form onSubmit={saveProfile} className="space-y-5">
              <Input label="Full name" leftIcon={UserRound} value={name} onChange={(e) => { setName(e.target.value); setNameError(''); }} error={nameError} disabled={savingProfile} autoComplete="name" />
              <Input label="Email" value={admin?.email || ''} disabled hint="Email is your sign-in identifier and cannot be changed here." />
              <div className="flex justify-end">
                <Button type="submit" icon={Save} loading={savingProfile} disabled={name.trim() === admin?.name}>
                  Save changes
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <CardHeader title="Change password" subtitle="Use at least 8 characters with a letter and a number" />
            <form onSubmit={changePassword} className="space-y-5">
              <PasswordInput label="Current password" value={pw.currentPassword} onChange={setPwField('currentPassword')} error={pwErrors.currentPassword} autoComplete="current-password" disabled={savingPw} />
              <div className="grid gap-5 sm:grid-cols-2">
                <PasswordInput label="New password" value={pw.newPassword} onChange={setPwField('newPassword')} error={pwErrors.newPassword} autoComplete="new-password" disabled={savingPw} />
                <PasswordInput label="Confirm new password" value={pw.confirm} onChange={setPwField('confirm')} error={pwErrors.confirm} autoComplete="new-password" disabled={savingPw} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" icon={KeyRound} loading={savingPw}>
                  Update password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
