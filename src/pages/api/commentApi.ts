import { client } from './client';
import { errorHandling } from '../../_common/errorHandling';

const COMMENT_URL: string = 'comments';

export interface CommentSubmitParams {
  readonly boardId: string;
  readonly userId: string;
  readonly content: string;
  readonly nickname: string;
}
export const CommentSubmitAPI = async (params: CommentSubmitParams) => {
  try {
    const URL: string = `${COMMENT_URL}/`;

    const res = await client.post(URL, params);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommentSubmitAPI', error: e });
  }
};

export interface CommentListParam {
  readonly boardId: string;
}
export const CommentListAPI = async (param: CommentListParam) => {
  try {
    const URL: string = `${COMMENT_URL}/list`;

    const res = await client.post(URL, param);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommentListAPI', error: e });
  }
};

export interface CommentInquiryParam {
  readonly userId: string;
}

export const CommentInquiryAPI = async (param: CommentInquiryParam) => {
  try {
    const URL: string = `${COMMENT_URL}/${param.userId}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommentInquiryAPI', error: e });
  }
};

export interface CommentUsersInquiryParam {
  readonly userId: string;
}
export const CommentUsersInquiryAPI = async (param: CommentInquiryParam) => {
  try {
    const URL: string = `${COMMENT_URL}/users/${param.userId}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommentUsersInquiryAPI', error: e });
  }
};
