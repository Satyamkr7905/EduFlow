export const USER_TYPES = ['Parent', 'Student', 'School'];
export const CATEGORIES = ['Scholarship', 'Concert', 'Admission', 'General Query'];
export const STATUSES = ['New', 'In Progress', 'Resolved'];

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/** Supported dashboard date ranges → number of days (null = all time) */
export const DATE_RANGES = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  all: null,
};
