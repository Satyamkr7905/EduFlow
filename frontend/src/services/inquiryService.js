import api from './api';

/** Remove empty filter values so the query string stays clean. */
const compact = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );

export const inquiryService = {
  async submit(payload) {
    const { data } = await api.post('/inquiries', payload);
    return data; // { success, message, data: { inquiry } }
  },

  async list(params) {
    const { data } = await api.get('/inquiries', { params: compact(params) });
    return { inquiries: data.data.inquiries, pagination: data.meta.pagination };
  },

  async get(id) {
    const { data } = await api.get(`/inquiries/${id}`);
    return data.data.inquiry;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/inquiries/${id}/status`, { status });
    return { inquiry: data.data.inquiry, message: data.message };
  },

  async remove(id) {
    const { data } = await api.delete(`/inquiries/${id}`);
    return data.message;
  },
};
