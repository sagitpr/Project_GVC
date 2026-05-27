import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token into every outgoing request if present in localstorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  register: async (username: string, email: string, password: md5OrPlainString) => {
    const res = await apiClient.post('/auth/register', { username, email, password });
    if (res.data.accessToken) {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  login: async (email: string, password: md5OrPlainString) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.accessToken) {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
};

export const scansApi = {
  detectWaste: async (base64Image: string) => {
    const res = await apiClient.post('/scans/detect', { image: base64Image });
    return res.data;
  },
  getHistory: async () => {
    const res = await apiClient.get('/scans/history');
    return res.data;
  },
  getScanDetail: async (scanId: string) => {
    const res = await apiClient.get(`/scans/${scanId}`);
    return res.data;
  }
};

export const analyticsApi = {
  getDashboard: async () => {
    const res = await apiClient.get('/analytics/dashboard');
    return res.data;
  }
};

type md5OrPlainString = string;
