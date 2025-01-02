import { client } from './client';
import { errorHandling } from '../../_common/errorHandling';

const REACTIONS_URL: string = 'reactions';

interface ReactionCountParams {
  readonly boardId: string;
}
export const ReactionCountAPI = async ({ boardId }: ReactionCountParams) =>
  await client.get(`${REACTIONS_URL}?boardId=${boardId}`);

interface ReactionListParams {
  readonly boardId: string;
}

export const ReactionListAPI = async ({ boardId }: ReactionListParams) =>
  await client.get(`${REACTIONS_URL}/list?boardId=${boardId}`);

export interface ReactionParams {
  readonly type: 'LIKE' | 'DISLIKE';
  readonly boardId: string;
  readonly userId: string;
  readonly reactionTarget: 'BOARD' | 'COMMENT' | 'REPLY';
}

export const ReactionApi = async (params: ReactionParams) => {
  try {
    const response = await client.post(`${REACTIONS_URL}/`, params);

    return response;
  } catch (e: any) {
    errorHandling({ text: 'ReactionApi', error: e });
  }
};
