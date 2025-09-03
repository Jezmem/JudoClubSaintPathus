import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login_check', {
      username: email,
      password: password,
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
  }) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/profile', userData);
    return response.data;
  },
};

// News API
export const newsAPI = {
  getAll: async (params?: { page?: number; limit?: number; category?: string; upcoming?: boolean }) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  create: async (newsData: any) => {
    const response = await api.post('/news', newsData);
    return response.data;
  },

  update: async (id: number, newsData: any) => {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/news/${id}`);
  },
};

// Gallery API
export const galleryAPI = {
  getAll: async (params?: { page?: number; limit?: number; category?: string; type?: string }) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  },

  create: async (galleryData: any) => {
    const response = await api.post('/gallery', galleryData);
    return response.data;
  },

  update: async (id: number, galleryData: any) => {
    const response = await api.put(`/gallery/${id}`, galleryData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/gallery/${id}`);
  },
};

// Schedule API
export const scheduleAPI = {
  getAll: async (params?: { dayOfWeek?: string; level?: string }) => {
    const response = await api.get('/schedules', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },

  create: async (scheduleData: any) => {
    const response = await api.post('/schedules', scheduleData);
    return response.data;
  },

  update: async (id: number, scheduleData: any) => {
    const response = await api.put(`/schedules/${id}`, scheduleData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/schedules/${id}`);
  },
};

// Instructor API
export const instructorAPI = {
  getAll: async () => {
    const response = await api.get('/instructors');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/instructors/${id}`);
    return response.data;
  },

  create: async (instructorData: any) => {
    const response = await api.post('/instructors', instructorData);
    return response.data;
  },

  update: async (id: number, instructorData: any) => {
    const response = await api.put(`/instructors/${id}`, instructorData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/instructors/${id}`);
  },
};

// Event API
export const eventAPI = {
  getAll: async (params?: { upcoming?: boolean; type?: string }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData: any) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  update: async (id: number, eventData: any) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/events/${id}`);
  },
};

// Registration API
export const registrationAPI = {
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/registrations', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/registrations/${id}`);
    return response.data;
  },

  create: async (registrationData: any) => {
    const response = await api.post('/registrations', registrationData);
    return response.data;
  },

  update: async (id: number, registrationData: any) => {
    const response = await api.put(`/registrations/${id}`, registrationData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/registrations/${id}`);
  },
};

// Contact Message API
export const contactAPI = {
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/contact-messages', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/contact-messages/${id}`);
    return response.data;
  },

  create: async (messageData: any) => {
    const response = await api.post('/contact-messages', messageData);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/contact-messages/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/contact-messages/${id}`);
  },
};

export default api;