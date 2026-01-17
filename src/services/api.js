import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Request interceptor – attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor – DO NOT REDIRECT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      return Promise.reject({
        type: 'network',
        message: 'Network error. Please check your connection.'
      });
    }

    const { status, data } = error.response;

    // ❗ IMPORTANT CHANGE:
    // No window.location.href here. Ever.
    // UI / route guards will handle redirects.

    if (status === 401) {
      return Promise.reject({
        type: 'auth',
        status: 401,
        message: data?.message || 'Unauthorized'
      });
    }

    if (status === 403) {
      return Promise.reject({
        type: 'permission',
        status: 403,
        message: data?.message || 'Forbidden'
      });
    }

    if (status === 404) {
      return Promise.reject({
        type: 'notFound',
        status: 404,
        message: data?.message || 'Not found'
      });
    }

    if (status === 400) {
      return Promise.reject({
        type: 'validation',
        status: 400,
        message: data?.message || 'Bad request'
      });
    }

    if (status >= 500) {
      return Promise.reject({
        type: 'server',
        status,
        message: 'Server error. Try again later.'
      });
    }

    return Promise.reject({
      type: 'unknown',
      status,
      message: data?.message || 'Something went wrong'
    });
  }
);

export default api;
