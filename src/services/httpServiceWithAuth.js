import axios from "axios";

const defaultBaseURL = "https://ecec-103-8-115-242.ngrok-free.app";
const backendBaseURL = process.env.BACKEND_BASE_URL || defaultBaseURL;

const getToken = () => {
    return localStorage.getItem('token');
}

const httpServiceWithAuth = axios.create({
  baseURL: backendBaseURL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

httpServiceWithAuth.interceptors.request.use(
  (config) => {
    // Refresh the token for each request
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const get = async (url, config = {}) => {
  try {
    const response = await httpServiceWithAuth.get(url, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    throw error.response.data;
  }
};

export const post = async (url, data, config = {}) => {
  try {
    const response = await httpServiceWithAuth.get(url, data, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    throw error.response.data;
  }
};
