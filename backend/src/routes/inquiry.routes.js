import { Router } from 'express';
import * as controller from '../controllers/inquiry.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { inquiryLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import {
  createInquirySchema,
  inquiryIdSchema,
  listInquiriesSchema,
  updateStatusSchema,
} from '../validators/inquiry.validator.js';

const router = Router();

// Public – inquiry submission from the website
router.post('/', inquiryLimiter, validate(createInquirySchema), controller.create);

// Admin – everything below requires a valid JWT
router.use(requireAuth);
router.get('/', validate(listInquiriesSchema, 'query'), controller.list);
router.get('/:id', validate(inquiryIdSchema, 'params'), controller.getOne);
router.patch(
  '/:id/status',
  validate(inquiryIdSchema, 'params'),
  validate(updateStatusSchema),
  controller.updateStatus
);
router.delete('/:id', validate(inquiryIdSchema, 'params'), controller.remove);

export default router;
