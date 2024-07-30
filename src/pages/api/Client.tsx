import axios from "axios";
import { AxiosError } from "axios";

const BACK_URL: string = process.env.REACT_APP_API_BASE_URL as string;
console.log("BACK_URL : ", BACK_URL);
console.log(
  "BACK_URL.startsWith('https://') : ",
  BACK_URL.startsWith("https://"),
);

export const client = axios.create({
  baseURL: BACK_URL,
});
console.log("client.defaults.baseURL : ", client.defaults.baseURL);

client.defaults.headers.patch["Content-Type"] = "application/json";
client.defaults.headers.post["Content-Type"] = "application/json";

client.interceptors.request.use(
  async function (config) {
    const [accessToken, refreshToken] = await Promise.all([
      localStorage.getItem("access_token"),
      localStorage.getItem("refresh_token"),
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
          url: `${BACK_URL}/users/refresh/token`,
          method: "GET",
          headers: {
            Authorization: refreshToken,
          },
        });

        if (status && data) {
          await localStorage.setItem(
            "access_token",
            data.response.access_token,
          );

          await localStorage.setItem(
            "refresh_token",
            data.response.refresh_token,
          );

          return await axios.request(error.conig);
        }
      } catch (e: any) {
        if (e instanceof AxiosError && e.response) {
          console.log("catch check e : ", e);
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
