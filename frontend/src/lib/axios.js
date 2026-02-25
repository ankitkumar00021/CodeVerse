import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
console.log("Axios baseURL configured as:", baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Setup interceptor will be called from App.jsx with the getToken function
export const setupAxiosInterceptor = (getToken) => {
  // Add request interceptor to inject Clerk auth token
  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting Clerk token:", error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      console.error(`404 Error: Attempted URL was:`, error.config?.url);
      console.error(`Base URL: ${baseURL}`);
      console.error(`Full URL: ${error.config?.baseURL}${error.config?.url}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
