import { client } from "./Client";
import { isRejectedWithValue } from "@reduxjs/toolkit";

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

export interface CommentListParams {
  readonly boardId: string;
}
export const CommentListAPI = async ({ boardId }: CommentListParams) => {
  const URL: string = `comments?boardId=${boardId}`;

  const res = await client.get(URL);

  return res;
};

// export const MyCommentsAPI = async (userId: string) => {
//   try {
//     const URL: string = `users/comments/${userId}`;
//     const res = await client.get(URL);
//     return res.data.response;
//   } catch (e: any) {
//     if (!e.response) {
//       throw error;
//     }
//     return isRejectedWithValue(e.response.data);
//   }
// };
