import axios from 'axios';
import { AxiosError } from 'axios';

const BACK_URL: string = process.env.REACT_APP_API_BASE_URL as string;

export const client = axios.create({
  baseURL: BACK_URL,
});

client.defaults.headers.patch['Content-Type'] = 'application/json';
client.defaults.headers.post['Content-Type'] = 'application/json';

client.interceptors.request.use(
  async function (config) {
    const [accessToken, refreshToken] = await Promise.all([
      localStorage.getItem('access_token'),
      localStorage.getItem('refresh_token'),
    ]);

    if (!accessToken && config.headers) {
      config.headers.Authorization = '';
      config.headers.refreshToken = '';
    }

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers.refreshToken = `Bearer ${refreshToken}`;
    }

    return Promise.resolve(config);
  },
  async function (error) {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken } = error.config.headers;

    if (error.response && error.response.status === 401) {
      try {
        const { status, data } = await axios({
          url: `${BACK_URL}/users/refresh/token`,
          method: 'GET',
          headers: {
            Authorization: refreshToken,
          },
        });

        if (status && data) {
          localStorage.setItem('access_token', data.response.access_token);

          localStorage.setItem('refresh_token', data.response.refresh_token);
          error.config.headers.Authorization = `Bearer ${data.response.access_token}`;

          return await axios.request(error.config);
        }
      } catch (e: any) {
        if (e instanceof AxiosError && e.response) {
          console.log('catch check e : ', e);
          const code = e.response.status;

          if (code === 500) {
            console.log({
              type: 'error',
              position: 'top',
              text1: '서버 에러',
              visibilityTime: 200,
            });
          }
        }
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
