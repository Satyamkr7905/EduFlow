import api from './api';

export const authService = {
  async login({ email, password, rememberMe }) {
    const { data } = await api.post('/auth/login', { email, password, rememberMe });
    return data.data; // { admin, token, expiresAt }
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data.data.admin;
  },

  async updateProfile(payload) {
    const { data } = await api.patch('/auth/me', payload);
    return data.data.admin;
  },

  async changePassword(payload) {
    const { data } = await api.patch('/auth/password', payload);
    return data.message;
  },
};
