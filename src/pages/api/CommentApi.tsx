import { client } from "./Client";

export interface CommentSubmitParams {
  readonly boardId: string;
  readonly content: string;
  readonly nickname: string;
}
export const CommentSubmitAPI = async (params: CommentSubmitParams) => {
  const URL: string = "comments/";

  const res = await client.post(URL, params);

  return res;
};
