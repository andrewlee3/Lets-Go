import axios from 'axios';

// TODO: 백엔드 API baseURL 설정
// 환경 변수로 관리: process.env.NEXT_PUBLIC_API_URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// TODO: 백엔드 연동 시 인터셉터 활성화
// Request 인터셉터: 토큰 주입
apiClient.interceptors.request.use(
  (config) => {
    // TODO: localStorage에서 토큰 가져오기
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TODO: 백엔드 연동 시 인터셉터 활성화
// Response 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: 401 에러 시 로그인 페이지로 리다이렉트
    // if (error.response?.status === 401) {
    //   window.location.href = '/table-setup';
    // }
    return Promise.reject(error);
  }
);
