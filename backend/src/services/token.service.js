import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Sign a JWT for an admin. Only non-sensitive claims are embedded.
 */
export const signToken = (admin, { rememberMe = false } = {}) => {
  const expiresIn = rememberMe ? env.jwtRememberExpiresIn : env.jwtExpiresIn;
  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: 'admin' },
    env.jwtSecret,
    { expiresIn, issuer: 'eduflow-crm' }
  );
  const { exp } = jwt.decode(token);
  return { token, expiresAt: new Date(exp * 1000).toISOString() };
};

export const verifyToken = (token) =>
  jwt.verify(token, env.jwtSecret, { issuer: 'eduflow-crm', algorithms: ['HS256'] });
