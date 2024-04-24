import axios from "axios";
import { AxiosError } from "axios";

const BACK_URL = "http://127.0.0.1:9898";

export const client = axios.create({
  baseURL: BACK_URL,
});
client.defaults.headers.patch["Content-Type"] = "application/json";
client.defaults.headers.post["Content-Type"] = "application/json";

client.interceptors.request.use(
  async function (config) {
    const [accessToken, refreshToken] = await Promise.all([
      sessionStorage.getItem("access_token"),
      sessionStorage.getItem("refresh_token"),
    ]);

    if (!accessToken && config.headers) {
      config.headers.Authorization = "";
      config.headers.refreshToken = "";
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
          url: `http://${BACK_URL}/users/refresh/token`,
          method: "GET",
          headers: {
            Authorization: refreshToken,
          },
        });

        if (status && data) {
          await sessionStorage.setItem(
            "access_token",
            data.response.accessToken,
          );

          await sessionStorage.setItem(
            "refresh_token",
            data.response.refreshToken,
          );

          return await axios.request(error.conig);
        }
      } catch (e: any) {
        if (e instanceof AxiosError && e.response) {
          const code = e.response.status;

          if (code === 500) {
            console.log({
              type: "error",
              position: "top",
              text1: "서버 에러",
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
