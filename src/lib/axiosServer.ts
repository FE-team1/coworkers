import { redirect } from 'next/navigation';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { getServerCookie } from '@/lib/cookie/server';
import PATHS from '@/constants/paths';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosServer = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  adapter: 'fetch',
});

axiosServer.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & { _retry?: boolean }) => {
    const token = await getServerCookie('accessToken');
    if (!token || config._retry) return config;
    config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  }
);

axiosServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject({
        message: error.message,
        status: error.response?.status,
      });
    }

    originalRequest._retry = true;

    const refreshToken = await getServerCookie('refreshToken');
    if (!refreshToken) {
      redirect(`${PATHS.LOGIN}`);
    }

    const newAccessToken = await refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      redirect(`${PATHS.LOGIN}`);
    }

    originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
    return axiosServer(originalRequest);
  }
);

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/refresh-token`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' }, adapter: 'fetch' }
    );
    return res.data?.accessToken;
  } catch {
    return '';
  }
}

export default axiosServer;
