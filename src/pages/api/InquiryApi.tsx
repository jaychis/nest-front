import { client } from './Client';

export interface InquiryParam {
  title: string | null;
  nickname: string | null;
  content: string | null;
}

interface ListParams {
  readonly take: number;
  readonly page: number;
  readonly nickname: string;
  readonly requestedUserId?: string | null;
  readonly category?: string | null;
}

export const postContactApi = ({ title, nickname, content }: InquiryParam) => {
  const accessToken: string = localStorage.getItem('access_token') as string;
  try {
    const req = client.post(
      'contact/us',
      { title: title, nickname: nickname, content: content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log(req);
    return req;
  } catch (err) {
    console.error(err);
  }
};

export const getContactAllListAPi = async ({
  take,
  page,
  requestedUserId,
  nickname,
}: ListParams) => {
  const accessToken: string = localStorage.getItem('access_token') as string;
  try {
    let URL: string = `contact/us/list?page=${page}&take=${take}&nickname=${nickname}&status=${'INQUIRING'}`;
    if (requestedUserId) URL += `&requestedUserId=${requestedUserId}`;

    const res = await client.get(URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};

export interface CommentSubmitParams {
  readonly contactUsId: string;
  readonly userId: string;
  readonly content: string;
  readonly nickname: string;
}

export const submitCommentContactApi = async ({
  contactUsId,
  userId,
  content,
  nickname,
}: CommentSubmitParams) => {
  try {
    let URL = 'comments/contact-us';
    const res = await client.post(URL, {
      contactUsId,
      userId,
      content,
      nickname,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const commentContactListApi = async (contactUsId: string) => {
  try {
    let URL = 'comments/contact-us/list';
    const res = await client.post(URL, { contactUsId });
    return res;
  } catch (error) {}
};
