import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const LINKS = [
  { label: 'Home', to: '/', match: (loc) => loc.pathname === '/' && !loc.hash },
  { label: 'Programs', to: '/#programs', match: (loc) => loc.hash === '#programs' },
  { label: 'About', to: '/#about', match: (loc) => loc.hash === '#about' },
  { label: 'Contact', to: '/#contact', match: (loc) => loc.hash === '#contact' },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between rounded-full border px-3 py-2.5 transition-all duration-300 sm:px-4',
          scrolled ? 'border-line bg-white/90 shadow-soft backdrop-blur-md' : 'border-transparent bg-transparent'
        )}
      >
        <Logo className="pl-1" />

        {/* Desktop links */}
        <div className="hidden items-center gap-1 rounded-full bg-white/70 p-1 md:flex">
          {LINKS.map((link) => {
            const active = link.match(location);
            return (
              <Link
                key={link.label}
                to={link.to}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active ? 'text-white' : 'text-ink/80 hover:text-ink'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="public-nav-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/admin/login" className="rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink">
            Admin
          </NavLink>
          <Link to="/inquire">
            <Button variant="coral" size="sm" iconRight={ArrowUpRight} className="h-10 px-4">
              Submit Inquiry
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-7xl rounded-xl3 border border-line bg-white p-3 shadow-lift md:hidden"
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-ink hover:bg-cream"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/admin/login" className="rounded-2xl px-4 py-3 text-sm font-medium text-muted hover:bg-cream">
                Admin login
              </Link>
              <Link to="/inquire" className="mt-1">
                <Button variant="coral" className="w-full" iconRight={ArrowUpRight}>
                  Submit Inquiry
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
