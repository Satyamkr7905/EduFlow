/**
 * Consistent JSON envelope for every successful response:
 * { success: true, message, data, meta? }
 */
export const sendSuccess = (res, { statusCode = 200, message = 'OK', data = null, meta } = {}) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};
