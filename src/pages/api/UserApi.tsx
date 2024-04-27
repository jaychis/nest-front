import { client } from "./Client";
import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export interface ExistingEmailParams {
  readonly email: string;
}
export const ExistingEmail = async ({ email }: ExistingEmailParams) =>
  await client.get(`users/existing/email/${email}`);

export interface ExistingNicknameParams {
  readonly nickname: string;
}
export const ExistingNickname = async ({ nickname }: ExistingNicknameParams) =>
  await client.get(`users/existing/nickname/${nickname}`);

export interface ExistingPhoneParams {
  readonly phone: string;
}
export const ExistingPhone = async ({ phone }: ExistingPhoneParams) =>
  await client.get(`users/existing/phone/${phone}`);

export interface ProfileParams {
  readonly id: string;
}
export const ProfileAPI = createAsyncThunk(
  "ProfileAPI",
  async ({ id }: ProfileParams, thunkAPI) => {
    try {
      const URL: string = `users/profile/${id}`;

      const res = await client.get(URL);
      return res.data.response;
    } catch (e: any) {
      if (!e.response) {
        throw error;
      }
      return isRejectedWithValue(e.response.data);
    }
  },
);

export interface LoginParams {
  readonly email: string;
  readonly password: string;
}

// export const LoginAPI = createAsyncThunk(
//   "LoginAPI",
//   async (params: LoginParams) => {
//     try {
//       const URL: string = `${BACK_URL}/users/login`;
//
//       const res = await client.post(URL, params);
//       return res.data.response;
//     } catch (e: any) {
//       if (!e.response) {
//         throw error;
//       }
//       return isRejectedWithValue(e.response.data());
//     }
//   },
// );

export const LoginAPI = async (params: LoginParams) => {
  const URL: string = `users/login`;

  const res = await client.post(URL, params);
  return res;
};

export interface SignupParams {
  readonly email: string;
  readonly nickname: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly phone: string;
}
export const SignupAPI = async (params: SignupParams) => {
  const URL: string = `users`;

  const res = await client.post(URL, params);
  return res;
};
