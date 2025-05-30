import axios from 'axios';

// For Vite:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// For Create React App:
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (userData: { username: string; password: string; repassword: string }) => {
    const response = await api.post('/api/register', userData);
    return response.data;
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/api/login', credentials);
    const data = response.data as any
    const token = data.data.token
    if (token) {
      localStorage.setItem('token', token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
};

// User APIs
export const userAPI = {
  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData: { oldpassword: string; newpassword: string ;repassword: string}) => {
    const response = await api.put('/api/changepassword', passwordData);
    return response.data;
  },
};

interface PostDetailResponse {
  success: boolean;
  message: string;
  data: {
    post: {
      question_id: number;
      title: string;
      content: string;
      typePost: string;
      image_post: string;
      created: string;
    }
  }
}

// Post APIs
export const postAPI = {
  getPosts: async () => {
    const response = await api.get('/api/posts');
    return response.data;
  },

  getPostDetail: async (id: number) => {
    const response = await api.get<PostDetailResponse>(`/api/posts/${id}`);
    return response.data;
  },
};

export default api; 