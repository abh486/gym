import axios from 'axios';

// Create Axios instance
const apiClient = axios.create({
  baseURL: 'https://localhost:5000/api', // Your backend root URL
  timeout: 10000, // optional
});

// Request interceptor for adding tokens
apiClient.interceptors.request.use(
  config => {
    // Example: Attach token if available
    // const token = await getStoredToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Global error handling logic (show toast, log out, etc.)
    return Promise.reject(error);
  }
);

export default apiClient;
