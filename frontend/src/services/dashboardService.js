import api from './api';

export const dashboardService = {
  async stats(range = '30d') {
    const { data } = await api.get('/dashboard/stats', { params: { range } });
    return data.data;
  },

  async analytics(range = '30d') {
    const { data } = await api.get('/dashboard/analytics', { params: { range } });
    return data.data;
  },
};
