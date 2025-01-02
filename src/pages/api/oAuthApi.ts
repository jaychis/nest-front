import { client } from './client';
import { errorHandling } from '../../_common/errorHandling';

const OAUTH_URL: string = 'oauth';

interface KakaoOAuthLoginParam {
  readonly code: string;
}
export const KakaoOAuthLoginAPI = async (param: KakaoOAuthLoginParam) => {
  try {
    const URL: string = `${OAUTH_URL}/kakao/callback`;

    const res = await client.post(URL, param);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'UsersKakaoOAuthRedirectAPI', error: e });
  }
};

export const UsersKakaoOAuthSignUpAPI = async () => {
  try {
    const URL: string = `${OAUTH_URL}/kakao`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'UsersKakaoAuthSignUpAPI', error: e });
  }
};

export const UsersNaverOAuthSignUpAPI = async () => {
  try {
    const URL: string = `${OAUTH_URL}/naver`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'UsersNaverOAuthSignUpAPI', error: e });
  }
};
