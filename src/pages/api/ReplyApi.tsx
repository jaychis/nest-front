import { client } from "./Client";

export interface ReplySubmitParams {
  readonly nickname: string;
  readonly content: string;
  readonly commentId: string;
}

export const ReplySubmitAPI = async (params: ReplySubmitParams) => {
  const URL: string = "replies/";

  const res = await client.post(URL, params);

  return res;
};
