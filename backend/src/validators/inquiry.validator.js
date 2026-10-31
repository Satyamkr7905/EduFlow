import { z } from 'zod';
import {
  CATEGORIES,
  DATE_RANGES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  STATUSES,
  USER_TYPES,
} from '../utils/constants.js';

const PHONE_REGEX = /^\+?[0-9][0-9 \-()]{6,18}$/;

const enumField = (values, label) =>
  z.enum(values, {
    required_error: `${label} is required`,
    invalid_type_error: `${label} must be one of: ${values.join(', ')}`,
  });

/** Turn "" / undefined into undefined so optional filters are skipped cleanly. */
const optionalEnum = (values) =>
  z.preprocess((v) => (v === '' || v === undefined ? undefined : v), z.enum(values).optional());

const optionalDate = z.preprocess(
  (v) => (v === '' || v === undefined ? undefined : v),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
);

export const createInquirySchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name is too long'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Enter a valid email address')
    .max(255),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(PHONE_REGEX, 'Enter a valid phone number (7–15 digits)'),
  user_type: enumField(USER_TYPES, 'User type'),
  category: enumField(CATEGORIES, 'Inquiry category'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters'),
});

export const listInquiriesSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    search: z.string().trim().max(120).optional(),
    category: optionalEnum(CATEGORIES),
    user_type: optionalEnum(USER_TYPES),
    status: optionalEnum(STATUSES),
    from: optionalDate,
    to: optionalDate,
    sort: z.enum(['created_at', 'updated_at', 'name', 'status']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine((q) => !(q.from && q.to) || q.from <= q.to, {
    path: ['to'],
    message: '"to" date must be after "from" date',
  });

export const inquiryIdSchema = z.object({
  id: z.string().uuid('Invalid inquiry id'),
});

export const updateStatusSchema = z.object({
  status: enumField(STATUSES, 'Status'),
});

export const dashboardRangeSchema = z.object({
  range: z.enum(Object.keys(DATE_RANGES)).default('30d'),
});
