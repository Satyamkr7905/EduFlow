import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, { message: 'Signed in successfully', data: result });
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { admin: req.admin } });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.admin.id, req.body);
  sendSuccess(res, { message: 'Password updated successfully' });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const admin = await authService.updateProfile(req.admin.id, req.body);
  sendSuccess(res, { message: 'Profile updated successfully', data: { admin } });
});
