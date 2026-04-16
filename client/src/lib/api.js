import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('rl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rl_token');
      localStorage.removeItem('rl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
