import { client } from "./Client";

interface ReactionCountParams {
  readonly boardId: string;
}
export const ReactionCountAPI = async ({ boardId }: ReactionCountParams) =>
  await client.get(`reactions?boardId=${boardId}`);

interface ReactionListParams {
  readonly boardId: string;
}

export const ReactionListAPI = async ({ boardId }: ReactionListParams) =>
  await client.get(`reactions/list?boardId=${boardId}`);

export interface ReactionParams {
  readonly type: "LIKE" | "DISLIKE";
  readonly boardId: string;
  readonly userId: string;
  readonly reactionTarget: "BOARD" | "COMMENT" | "REPLY";
}

export const ReactionAPI = async (params: ReactionParams) => {
  const response = await client.post("reactions", params);

  return response;
};
