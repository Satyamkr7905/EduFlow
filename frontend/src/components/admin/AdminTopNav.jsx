import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  ChevronDown,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import NotificationsPanel from './NotificationsPanel';
import { inquiryService } from '../../services/inquiryService';
import { cn } from '../../utils/cn';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminTopNav() {
  const { admin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Lightweight poll for the unread badge (count of "New" inquiries)
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { pagination } = await inquiryService.list({ status: 'New', limit: 1 });
        if (active) setNewCount(pagination.total);
      } catch {
        /* badge is best-effort */
      }
    };
    load();
    const timer = setInterval(load, 60_000);
    const onRefresh = () => load();
    window.addEventListener('inquiries:changed', onRefresh);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener('inquiries:changed', onRefresh);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('You have been signed out.');
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-line bg-white/90 px-3 py-2 shadow-soft backdrop-blur-md">
        <Logo to="/admin" className="pl-1" />

        {/* Desktop nav – dark pill on the active item */}
        <nav className="hidden items-center gap-1 rounded-full bg-cream p-1 md:flex" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="relative">
              {({ isActive }) => (
                <span
                  className={cn(
                    'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-white' : 'text-ink/70 hover:text-ink'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-nav-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Dropdown
            width="w-80 sm:w-96"
            trigger={({ toggle, open }) => (
              <button
                type="button"
                onClick={toggle}
                className={cn(
                  'focus-ring relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:bg-cream',
                  open && 'bg-cream'
                )}
                aria-label="Notifications"
              >
                <Bell size={17} />
                {newCount > 0 && (
                  <motion.span
                    key={newCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-semibold text-white"
                  >
                    {newCount > 99 ? '99+' : newCount}
                  </motion.span>
                )}
              </button>
            )}
          >
            {({ close }) => <NotificationsPanel onNavigate={close} />}
          </Dropdown>

          {/* Profile */}
          <Dropdown
            width="w-60"
            trigger={({ toggle, open }) => (
              <button
                type="button"
                onClick={toggle}
                className={cn(
                  'focus-ring flex items-center gap-2 rounded-full border border-line bg-white p-1 pr-2 transition hover:bg-cream',
                  open && 'bg-cream'
                )}
                aria-label="Account menu"
              >
                <Avatar name={admin?.name} size="sm" tone="bg-ink text-white" />
                <span className="hidden max-w-[9rem] truncate text-sm font-medium text-ink lg:block">
                  {admin?.name}
                </span>
                <ChevronDown size={14} className={cn('text-muted transition-transform', open && 'rotate-180')} />
              </button>
            )}
          >
            {({ close }) => (
              <>
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-ink">{admin?.name}</p>
                  <p className="truncate text-xs text-muted">{admin?.email}</p>
                </div>
                <div className="my-1 h-px bg-line" />
                <DropdownItem
                  icon={UserRound}
                  onClick={() => {
                    close();
                    navigate('/admin/settings');
                  }}
                >
                  Profile & settings
                </DropdownItem>
                <DropdownItem
                  icon={ExternalLink}
                  onClick={() => {
                    close();
                    window.open('/', '_blank', 'noopener');
                  }}
                >
                  View public site
                </DropdownItem>
                <div className="my-1 h-px bg-line" />
                <DropdownItem icon={LogOut} danger onClick={handleLogout}>
                  Sign out
                </DropdownItem>
              </>
            )}
          </Dropdown>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink md:hidden"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-7xl rounded-xl3 border border-line bg-white p-2 shadow-lift md:hidden"
          >
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                      isActive ? 'bg-ink text-white' : 'text-ink hover:bg-cream'
                    )
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
            <Link to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted hover:bg-cream">
              <ExternalLink size={16} /> View public site
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
