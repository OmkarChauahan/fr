import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        type: "network",
        message: "Network error",
      });
    }

    const { status, data } = error.response;

    if (status === 401)
      return Promise.reject({ type: "auth", message: data?.message });

    if (status === 404)
      return Promise.reject({ type: "notFound", message: "Not found" });

    return Promise.reject(error);
  }
);

export default api;
