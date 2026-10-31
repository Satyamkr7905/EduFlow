import { verifyToken } from '../services/token.service.js';
import { findAdminById } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Requires a valid "Authorization: Bearer <jwt>" header.
 * Attaches the admin (without password hash) to req.admin.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('Authentication token is missing.');
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Your session has expired. Please sign in again.');
    }
    throw ApiError.unauthorized('Invalid authentication token.');
  }

  const admin = await findAdminById(payload.sub);
  if (!admin) {
    throw ApiError.unauthorized('This account no longer exists.');
  }

  req.admin = admin;
  next();
});
