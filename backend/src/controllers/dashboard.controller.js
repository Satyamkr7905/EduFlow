import * as dashboardService from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const stats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getStats(req.query.range);
  sendSuccess(res, { data });
});

export const analytics = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAnalytics(req.query.range);
  sendSuccess(res, { data });
});
