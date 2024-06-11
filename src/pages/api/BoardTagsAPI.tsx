import { ErrorHandling } from "../../_common/ErrorHandling";
import { client } from "./Client";

const BoardTagsURL: string = "board/tags";
export interface BoardTagsSubmitParams {
  readonly tags: string[];
  readonly boardId: string;
}

export const BoardTagsSubmitAPI = async (params: BoardTagsSubmitParams) => {
  try {
    const URL: string = `${BoardTagsURL}/`;

    const res = await client.post(URL, params);
    return res;
  } catch (e: any) {
    ErrorHandling({ text: "BoardTagsSubmitAPI", error: e });
  }
};

export interface BoardTagsReadParams {
  readonly tagId: string;
  readonly boardId: string;
}

export const BoardTagsReadAPI = async ({
  tagId,
  boardId,
}: BoardTagsReadParams) => {
  try {
    const URL: string = `${BoardTagsURL}?tagId=${tagId}&boardId=${boardId}`;

    const res = await client.get(URL);
    return res;
  } catch (e: any) {
    ErrorHandling({ text: "BoardTagsReadAPI", error: e });
  }
};

export interface BoardTagsDeleteParams {
  readonly tagId: string;
  readonly boardId: string;
}

export const BoardTagsDeleteAPI = async (params: BoardTagsDeleteParams) => {
  try {
    const URL: string = `${BoardTagsURL}/`;

    const config = {
      method: "delete",
      url: URL,
      data: params,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await client.delete(URL, config);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "BoardTagsDeleteAPI", error: e });
  }
};
