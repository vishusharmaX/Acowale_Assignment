import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const feedbackService = {
  submitFeedback: async (data) => {
    const res = await api.post('/api/feedback', data);
    return res.data;
  },

  getFeedbacks: async (params) => {
    const res = await api.get('/api/feedback', { params });
    return res.data;
  },

  getFeedbackDetails: async (id) => {
    const res = await api.get(`/api/feedback/${id}`);
    return res.data;
  },

  deleteFeedback: async (id) => {
    const res = await api.delete(`/api/feedback/${id}`);
    return res.data;
  },
};

export const analyticsService = {
  getAnalytics: async () => {
    const res = await api.get('/api/analytics');
    return res.data;
  },
};

export const systemService = {
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
};

export default api;
