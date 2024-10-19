import { client } from './Client';
import { errorHandling } from '../../_common/ErrorHandling';

const OAUTH_URL: string = 'oauth';

export const UsersKakaoOAuthLoginAPI = async () => {
  try {
    // const URL: string = `${OAUTH_URL}/kakao/callback?code=${code}`;
    const URL: string = `${OAUTH_URL}/kakao/login`;

    const res = await client.get(URL);
    console.log('UsersKakaoOAuthRedirectAPI res : ', res);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'UsersKakaoOAuthRedirectAPI', error: e });
  }
};

export const UsersKakaoOAuthSignUpAPI = async () => {
  try {
    const URL: string = `${OAUTH_URL}/kakao`;

    const res = await client.get(URL);
    console.log('UsersKakaoAuthSignUpAPI res : ', res);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'UsersKakaoAuthSignUpAPI', error: e });
  }
};

export const UsersNaverOAuthSignUpAPI = async () => {
  try {
    const URL: string = `${OAUTH_URL}/naver`;

    const res = await client.get(URL);
    console.log('UsersNaverOAuthSignUpAPI res : ', res);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'UsersNaverOAuthSignUpAPI', error: e });
  }
};
