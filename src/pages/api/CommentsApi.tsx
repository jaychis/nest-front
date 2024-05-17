import { client } from "./Client";

export interface CommentsSubmitParams {
  readonly boardId: string;
  readonly content: string;
  readonly nickname: string;
}
export const CommentsSubmitAPI = async (params: CommentsSubmitParams) => {
  const URL: string = "comments/";

  const res = await client.post(URL, params);
  console.log("CommentsSubmitAPI res : ", res);

  return res;
};
