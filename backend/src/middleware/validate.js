import { ApiError } from '../utils/ApiError.js';

/**
 * Validate a request segment ("body" | "query" | "params") against a zod schema.
 * The parsed (and coerced) value replaces the original so controllers receive
 * clean, typed data.
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.') || source,
      message: issue.message,
    }));
    return next(ApiError.badRequest('Validation failed', errors));
  }

  if (source === 'query') {
    // Express 4 exposes req.query as a plain, writable object.
    for (const key of Object.keys(req.query)) delete req.query[key];
    Object.assign(req.query, result.data);
  } else {
    req[source] = result.data;
  }
  next();
};
