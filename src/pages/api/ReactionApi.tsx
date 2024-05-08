import { client } from "./Client";

interface ReactionCountParams {
  readonly boardId: string;
  readonly userId: string;
}
export const ReactionCountAPI = async ({
  boardId,
  userId,
}: ReactionCountParams) =>
  await client.get(`reactions?boardId=${boardId}&userId=${userId}`);

export interface ReactionParams {
  readonly type: "LIKE" | "DISLIKE";
  readonly boardId: string;
  readonly userId: string;
}

export const ReactionAPI = async (params: ReactionParams) => {
  const response = await client.post("reactions", params);

  return response;
};
