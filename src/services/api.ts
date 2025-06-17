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
  register: async (userData: { username: string; password: string; repassword: string; server_id: number; token: string }) => {
    const response = await api.post('/api/register', userData);
    return response.data as any;
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

  getListServer: async () => {
    const response = await api.get('/api/list-server');
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

interface CreatePostResponse {
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
  getPosts: async (page?: number) => {
    const response = await api.get(`/api/posts${page ? `?page=${page}` : ''}`);
    return response.data;
  },

  getPostDetail: async (id: number) => {
    const response = await api.get<PostDetailResponse>(`/api/posts/${id}`);
    return response.data;
  },

  createPost: async (formData: FormData) => {
    const response = await api.post<CreatePostResponse>('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
const buildRankingRequest = async (type: string, isTopNewbie: boolean = false, sv: number | null = null) => {
  const params = new URLSearchParams();
  if (isTopNewbie) params.append('isTopNewbie', 'true');
  if (sv !== null) params.append('sv', sv.toString());

  const queryString = params.toString();
  const response = await api.get(`/api/ranking/${type}${queryString ? `?${queryString}` : ''}`);
  return response.data;
};
// Ranking APIs
export const rankingAPI = {
   
  getPowerRanking: async (isTopNewbie: boolean = false, sv: number | null = null) => {
    return buildRankingRequest('power', isTopNewbie, sv);
  },
  getRechargeRanking: async (isTopNewbie: boolean = false, sv: number | null = null) => {
    return buildRankingRequest('recharge', isTopNewbie, sv);
  },
  getEventRanking: async (isTopNewbie: boolean = false, sv: number | null = null) => {
    return buildRankingRequest('event', isTopNewbie, sv);
  },
  getTaskRanking: async (isTopNewbie: boolean = false, sv: number | null = null) => {
    return buildRankingRequest('task', isTopNewbie, sv);
  },
};

export const milestoneAPI = {
  
  receiveMilestone: async (milestone: number) => {
    const response = await api.post('/api/milestone', { milestone });
    return response.data;
  },
};



export default api; 