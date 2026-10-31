import * as inquiryService from '../services/inquiry.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const create = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.createInquiry(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Your inquiry has been submitted. Our team will reach out shortly.',
    data: { inquiry },
  });
});

export const list = asyncHandler(async (req, res) => {
  const { items, pagination } = await inquiryService.listInquiries(req.query);
  sendSuccess(res, { data: { inquiries: items }, meta: { pagination } });
});

export const getOne = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.getInquiryById(req.params.id);
  sendSuccess(res, { data: { inquiry } });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.updateInquiryStatus(req.params.id, req.body.status);
  sendSuccess(res, { message: `Status updated to "${inquiry.status}"`, data: { inquiry } });
});

export const remove = asyncHandler(async (req, res) => {
  await inquiryService.deleteInquiry(req.params.id);
  sendSuccess(res, { message: 'Inquiry deleted' });
});
