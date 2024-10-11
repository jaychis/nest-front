import { client } from "./Client";
import { ErrorHandling } from "../../_common/ErrorHandling";

export interface CommentSubmitParams {
  readonly boardId: string;
  readonly userId: string;
  readonly content: string;
  readonly nickname: string;
}
export const CommentSubmitAPI = async (params: CommentSubmitParams) => {
  try {
    const URL: string = "comments/";

    const res = await client.post(URL, params);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommentSubmitAPI", error: e });
  }
};

export interface CommentListParam {
  readonly boardId: string;
}
export const CommentListAPI = async (param: CommentListParam) => {
  try {
    const URL: string = `comments/list`;

    const res = await client.post(URL, param);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommentListAPI", error: e });
  }
};

export interface CommentInquiryParam {
  readonly userId: string;
}

export const CommentInquiryAPI = async ( userId: string) => {
  try {
    const URL: string = `comments/${userId}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommentInquiryAPI", error: e });
  }
};
