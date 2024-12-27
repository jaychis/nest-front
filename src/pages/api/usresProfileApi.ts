import { errorHandling } from '../../_common/errorHandling';
import { client } from './client';

const USERS_PROFILE_URL: string = 'users/profile';

export interface UsersProfilePictureParam {
  readonly profileImage: string | null;
}

export const UsersProfilePictureAPI = async (
  param: UsersProfilePictureParam,
) => {
  const URL: string = `${USERS_PROFILE_URL}`;

  try {
    const res = await client.post(URL, param);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'UsersProfilePictureAPI', error: e });
  }
};
