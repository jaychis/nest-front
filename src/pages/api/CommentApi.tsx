import { client } from "./Client";

export interface CommentSubmitParams {
  readonly boardId: string;
  readonly userId: string;
  readonly content: string;
  readonly nickname: string;
}
export const CommentSubmitAPI = async (params: CommentSubmitParams) => {
  const URL: string = "comments/";

  const res = await client.post(URL, params);

  return res;
};

export interface CommentListParam {
  readonly boardId: string;
}
export const CommentListAPI = async ({ boardId }: CommentListParam) => {
  const URL: string = `comments?boardId=${boardId}`;

  const res = await client.get(URL);

  return res;
};

export interface CommentInquiryParam {
  readonly userId: string;
}

export const CommentInquiryAPI = async ({ userId }: CommentInquiryParam) => {
  const URL: string = `comments/${userId}`;

  const res = await client.get(URL);

  return res;
};
