import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized (invalid token, token mismatch)
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      
      if (errorCode === 'TOKEN_MISMATCH') {
        // User logged in from another device - force logout
        console.log('⚠️ Token mismatch detected - logging out');
        localStorage.removeItem('token');
        window.location.href = '/login?error=session_expired';
        return Promise.reject(error);
      }
      
      // Other 401 errors (invalid token, expired token)
      console.log('⚠️ Unauthorized access - invalid token');
    }
    
    // Handle 403 - Forbidden (already logged in on another device)
    if (error.response?.status === 403) {
      const errorCode = error.response?.data?.code;
      
      if (errorCode === 'ALREADY_LOGGED_IN') {
        // Let the Login component handle this error with proper UI
        console.log('⚠️ Already logged in on another device');
        // Don't redirect here, let the component show the error message
      }
    }
    
    // Log all errors for debugging
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        code: error.response.data?.code,
        message: error.response.data?.message
      });
    } else if (error.request) {
      console.error('Network Error: No response received', error.request);
    } else {
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;