import { Router } from 'express';
import authRoutes from './auth.routes.js';
import inquiryRoutes from './inquiry.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import { checkConnection } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    const dbTime = await checkConnection();
    sendSuccess(res, { message: 'EduFlow API is healthy', data: { dbTime } });
  })
);

router.use('/auth', authRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
