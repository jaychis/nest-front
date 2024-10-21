import { client } from './Client';
import { createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import { errorHandling } from '../../_common/ErrorHandling';

const USERS_URL: string = 'users';

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
  let URL: string = `${USERS_URL}/inquiry?nickname=${nickname}&take=${take}`;
  if (lastId) URL += `&lastId=${lastId}`;

  const res = await client.get(URL);

  return res;
};
export interface ExistingEmailParams {
  readonly email: string;
}
export const ExistingEmailAPI = async ({ email }: ExistingEmailParams) =>
  await client.get(`${USERS_URL}/existing/email/${email}`);

export interface ExistingNicknameParams {
  readonly nickname: string;
}
export const ExistingNicknameAPI = async ({
  nickname,
}: ExistingNicknameParams) =>
  await client.get(`${USERS_URL}/existing/nickname/${nickname}`);

export interface ExistingPhoneParams {
  readonly phone: string;
}
export const ExistingPhoneAPI = async ({ phone }: ExistingPhoneParams) =>
  await client.get(`${USERS_URL}/existing/phone/${phone}`);

export interface ProfileParams {
  readonly id: string;
}

export const ProfileAPI = async ({ id }: ProfileParams) =>
  await client.get(`${USERS_URL}/profile/${id}`);

export const ReduxProfileAPI = createAsyncThunk(
  'ReduxProfileAPI',
  async ({ id }: ProfileParams, thunkAPI) => {
    try {
      const URL: string = `${USERS_URL}/profile/${id}`;

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
  const URL: string = `${USERS_URL}/login`;

  const res = await client.post(URL, params);
  return res;
};

export const RefreshTokenAPI = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('No refresh token found');

  try {
    const res = await client.get(`${USERS_URL}/refresh/token`, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    return res;
  } catch (e: any) {
    if (e.response) {
      const { status, data } = e.response;
      if (status === 400) {
        if (
          data.message === 'nicknameRequired' ||
          data.message === 'emailRequired'
        ) {
          throw new Error(data.message);
        }
      } else if (status === 500) {
        throw new Error('internalServerError');
      }
    }
    throw new Error('An unknown error occurred');
  }
};

export interface SignupParams {
  readonly email: string;
  readonly nickname: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly phone: string;
}
export const SignupAPI = async (params: SignupParams) => {
  const URL: string = `${USERS_URL}`;

  const res = await client.post(URL, params);
  return res;
};

export const SendEmail = async (email: string) => {
  let URL = 'users/send-email';
  try {
    const res = await client.post(URL, { email });
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface VerifyParams {
  readonly email: string;
  readonly verificationCode: string;
}

export const VerifyEmail = async ({
  email,
  verificationCode,
}: VerifyParams) => {
  let URL = 'users/verify-email';
  try {
    const res = await client.post(URL, { email, verificationCode });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export interface PasswordResetParsms {
  email: string;
  password: string;
  confirmPassword?: string;
}

export const PasswordReset = async ({
  email,
  password,
}: PasswordResetParsms) => {
  let URL = 'users/password/reset';
  try {
    const res = await client.post(URL, { email, password });
    return res;
  } catch (error) {
    console.error(error);
  }
};
