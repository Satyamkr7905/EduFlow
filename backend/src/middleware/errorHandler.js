import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/** Map low-level Postgres errors onto safe, user-facing API errors. */
const translatePgError = (err) => {
  switch (err.code) {
    case '23505': // unique_violation
      return ApiError.conflict('A record with the same unique value already exists.');
    case '23514': // check_violation
      return ApiError.badRequest('One or more fields contain invalid values.');
    case '23502': // not_null_violation
      return ApiError.badRequest('A required field is missing.');
    case '22P02': // invalid_text_representation (e.g. bad UUID)
      return ApiError.badRequest('Invalid identifier format.');
    case 'ECONNREFUSED':
    case 'ENOTFOUND':
    case '57P01':
    case '08006':
    case '08001':
      return new ApiError(503, 'Database is currently unavailable. Please try again shortly.');
    default:
      return null;
  }
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const translated = translatePgError(error);
    if (translated) {
      error = translated;
    } else if (error.type === 'entity.parse.failed') {
      error = ApiError.badRequest('Malformed JSON body.');
    } else if (error.type === 'entity.too.large') {
      error = new ApiError(413, 'Request body is too large.');
    } else {
      error = new ApiError(500, 'Something went wrong. Please try again later.');
    }
  }

  if (error.statusCode >= 500 || !env.isProduction) {
    console.error(`[error] ${req.method} ${req.originalUrl} →`, err.stack || err);
  }

  const body = {
    success: false,
    message: error.message,
  };
  if (error.details) body.errors = error.details;
  if (!env.isProduction && error.statusCode === 500 && err?.message) {
    body.debug = err.message;
  }

  res.status(error.statusCode).json(body);
};
