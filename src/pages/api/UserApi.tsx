import { BACK_URL, client } from "./Client";

export interface LoginParams {
  readonly email: string;
  readonly password: string;
}

export const LoginAPI = async (params: LoginParams) => {
  const URL: string = `${BACK_URL}/users/login`;

  const res = await client.post(URL, params);
  return res;
};

export interface SignupParams {
  readonly email: string;
  readonly nickname: string;
  readonly password: string;
  readonly phone: string;
}
