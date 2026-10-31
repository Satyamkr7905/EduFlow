import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { APP_NAME } from '../../utils/constants';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Programs', to: '/#programs' },
      { label: 'About us', to: '/#about' },
      { label: 'Contact', to: '/#contact' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { label: 'Submit an inquiry', to: '/inquire' },
      { label: 'Admin sign in', to: '/admin/login' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-16 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-xl4 border border-line bg-white px-6 py-10 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {APP_NAME} connects parents, students and schools with the right programs, scholarships and
              events — and helps our team respond to every inquiry quickly.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-muted transition hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Built with care for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
