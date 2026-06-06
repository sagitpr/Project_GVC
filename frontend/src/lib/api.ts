import axios from 'axios';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://smartsort-backend-52177643997.asia-southeast2.run.app/api';

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

export const educationApi = {
  getCategories: async () => {
    const res = await apiClient.get('/education/categories');
    return res.data;
  },
  getByCategory: async (category?: string) => {
    const params = category ? { category } : {};
    const res = await apiClient.get('/education', { params });
    return res.data;
  },
  getDetail: async (id: string) => {
    const res = await apiClient.get(`/education/${id}`);
    return res.data;
  },
};

export const communityApi = {
  listPosts: async (page = 1, limit = 10) => {
    const res = await apiClient.get('/community', { params: { page, limit } });
    return res.data;
  },
  getDetail: async (id: string) => {
    const res = await apiClient.get(`/community/${id}`);
    return res.data;
  },
  createPost: async (data: { title: string; content: string; imageUrl?: string }) => {
    const res = await apiClient.post('/community', data);
    return res.data;
  },
  deletePost: async (id: string) => {
    const res = await apiClient.delete(`/community/${id}`);
    return res.data;
  },
  likePost: async (id: string) => {
    const res = await apiClient.patch(`/community/${id}/like`);
    return res.data;
  },
};

export const pickupApi = {
  createPickup: async (data: {
    wasteCategory: string;
    weight: number;
    address: string;
    latitude?: number;
    longitude?: number;
    pickupTime?: string;
  }) => {
    const res = await apiClient.post('/pickups', data);
    return res.data;
  },
  getMyPickups: async () => {
    const res = await apiClient.get('/pickups');
    return res.data;
  },
  getPickupDetail: async (id: string) => {
    const res = await apiClient.get(`/pickups/${id}`);
    return res.data;
  },
  cancelPickup: async (id: string) => {
    const res = await apiClient.patch(`/pickups/${id}/cancel`);
    return res.data;
  }
};

export const notificationApi = {
  getNotifications: async (page = 1, limit = 20) => {
    const res = await apiClient.get('/notifications', { params: { page, limit } });
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await apiClient.get('/notifications/unread-count');
    return res.data;
  },
  markAsRead: async (id: string) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await apiClient.patch('/notifications/read-all');
    return res.data;
  },
  deleteNotification: async (id: string) => {
    const res = await apiClient.delete(`/notifications/${id}`);
    return res.data;
  },
};

export const walletApi = {
  getWallet: async () => {
    const res = await apiClient.get('/wallet');
    return res.data;
  },
  getTransactions: async (page = 1, limit = 20) => {
    const res = await apiClient.get('/wallet/transactions', { params: { page, limit } });
    return res.data;
  },
  topUp: async (amount: number) => {
    const res = await apiClient.post('/wallet/topup', { amount });
    return res.data;
  },
  withdraw: async (amount: number, description?: string) => {
    const res = await apiClient.post('/wallet/withdraw', { amount, description });
    return res.data;
  },
};

export const rewardsApi = {
  listRewards: async () => {
    const res = await apiClient.get('/rewards');
    return res.data;
  },
  getRewardDetail: async (id: string) => {
    const res = await apiClient.get(`/rewards/${id}`);
    return res.data;
  },
  claimReward: async (id: string) => {
    const res = await apiClient.post(`/rewards/${id}/claim`);
    return res.data;
  },
  getMyClaims: async () => {
    const res = await apiClient.get('/rewards/my/claims');
    return res.data;
  },
};

type md5OrPlainString = string;
