import { client } from "./Client";
import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export interface UsersInquiryParams {
  readonly nickname: string;
  readonly take: number;
  readonly lastId?: string | null;
}

export const UsersInquiryAPI = async ({
  nickname,
  take,
  lastId,
}: UsersInquiryParams) => {
  let URL: string = `users/inquiry?nickname=${nickname}&take=${take}`;
  if (lastId) URL += `&lastId=${lastId}`;

  const res = await client.get(URL);
  console.log("res : ", res);

  return res;
};
export interface ExistingEmailParams {
  readonly email: string;
}
export const ExistingEmailAPI = async ({ email }: ExistingEmailParams) =>
  await client.get(`users/existing/email/${email}`);

export interface ExistingNicknameParams {
  readonly nickname: string;
}
export const ExistingNicknameAPI = async ({
  nickname,
}: ExistingNicknameParams) =>
  await client.get(`users/existing/nickname/${nickname}`);

export interface ExistingPhoneParams {
  readonly phone: string;
}
export const ExistingPhoneAPI = async ({ phone }: ExistingPhoneParams) =>
  await client.get(`users/existing/phone/${phone}`);

export interface ProfileParams {
  readonly id: string;
}

export const ProfileAPI = async ({ id }: ProfileParams) =>
  await client.get(`users/profile/${id}`);

export const ReduxProfileAPI = createAsyncThunk(
  "ReduxProfileAPI",
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

// 새로운 API 함수들 추가
export const MyPostsAPI = async (userId: string) => {
  try {
    const URL: string = `users/posts/${userId}`;
    const res = await client.get(URL);
    return res.data.response;
  } catch (e: any) {
    if (!e.response) {
      throw error;
    }
    return isRejectedWithValue(e.response.data);
  }
};

export const MyCommentsAPI = async (userId: string) => {
  try {
    const URL: string = `users/comments/${userId}`;
    const res = await client.get(URL);
    return res.data.response;
  } catch (e: any) {
    if (!e.response) {
      throw error;
    }
    return isRejectedWithValue(e.response.data);
  }
};