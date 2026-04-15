import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Thêm một bộ đón chặn (interceptor) trước khi request được gửi đi
api.interceptors.request.use(
  (config) => {
    // 1. Quét tìm token trong localStorage
    const token = localStorage.getItem('token');
    
    // 2. Nếu có token, đội thêm mũ bảo hiểm (Header Authorization) vào request
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
