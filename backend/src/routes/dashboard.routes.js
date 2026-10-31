import { Router } from 'express';
import * as controller from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { dashboardRangeSchema } from '../validators/inquiry.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/stats', validate(dashboardRangeSchema, 'query'), controller.stats);
router.get('/analytics', validate(dashboardRangeSchema, 'query'), controller.analytics);

export default router;
