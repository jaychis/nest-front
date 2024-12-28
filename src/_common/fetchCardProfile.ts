import { UsersGetProfileAPI } from '../pages/api/usresProfileApi';

export type FetchProfileImageType = null | string | undefined;
export const fetchProfileImage = async ({
  userId,
}: {
  readonly userId: string;
}) => {
  if (!userId) return;
  try {
    const response = await UsersGetProfileAPI({ userId: userId });
    if (!response) return;

    const profileImage: null | string = response.data.response.profile_image;
    if (profileImage === null) {
      return null;
    } else {
      return profileImage;
    }
  } catch (e: any) {
    console.error(e);
  }
};
