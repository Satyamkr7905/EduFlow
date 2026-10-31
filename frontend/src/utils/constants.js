export const APP_NAME = 'EduFlow';

export const CONTACT = {
  email: 'satyamkumar9250@gmail.com',
  phone: '7033688853',
  phoneDisplay: '+91 70336 88853',
  phoneHref: 'tel:+917033688853',
  emailHref: 'mailto:satyamkumar9250@gmail.com',
};

export const API_PRODUCTION_URL = 'https://eduflow-mebg.onrender.com/api';
export const SITE_PRODUCTION_URL = 'https://edu-flow-wheat.vercel.app';

export const USER_TYPES = ['Parent', 'Student', 'School'];
export const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];
export const STATUSES = ['New', 'In Progress', 'Resolved'];

export const DATE_RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
];

/** Palette (kept in JS for Recharts, which can't read Tailwind classes) */
export const COLORS = {
  cream: '#F5F3ED',
  sand: '#E9E3D8',
  ink: '#171717',
  muted: '#85847F',
  sage: '#BFD7D0',
  sageDark: '#8FB3A8',
  coral: '#E47758',
  lavender: '#C9C8DA',
  lavenderDark: '#9F9DB8',
  line: '#EAE7DF',
};

export const STATUS_STYLES = {
  New: { bg: 'bg-lavender/60', text: 'text-ink', dot: 'bg-lavender-dark', color: COLORS.lavender },
  'In Progress': { bg: 'bg-coral/20', text: 'text-coral-dark', dot: 'bg-coral', color: COLORS.coral },
  Resolved: { bg: 'bg-sage/60', text: 'text-ink', dot: 'bg-sage-dark', color: COLORS.sage },
};

export const CATEGORY_COLORS = {
  Scholarship: COLORS.sage,
  Concert: COLORS.coral,
  Admission: COLORS.lavender,
  'General Query': COLORS.sand,
};

export const USER_TYPE_COLORS = {
  Parent: COLORS.ink,
  Student: COLORS.sage,
  School: COLORS.coral,
};

export const STORAGE_KEYS = {
  token: 'eduflow.token',
  remember: 'eduflow.remember',
};
