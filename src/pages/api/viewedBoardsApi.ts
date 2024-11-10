import { client } from './client';
import { errorHandling } from '../../_common/errorHandling';

const ViewedBoardsURL: string = 'viewed/boards';

export interface LogViewedBoardParams {
  readonly userId: string;
  readonly boardId: string;
}

export const LogViewedBoardAPI = async (params: LogViewedBoardParams) => {
  try {
    const URL: string = `${ViewedBoardsURL}/`;

    const res = await client.post(URL, params);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'LogViewedBoardAPI', error: e });
  }
};

export interface GetRecentViewedBoardsParam {
  readonly userId: string;
}

export const GetRecentViewedBoardsAPI = async ({
  userId,
}: GetRecentViewedBoardsParam) => {
  try {
    const URL: string = `${ViewedBoardsURL}/${userId}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetRecentViewedBoardsAPI', error: e });
  }
};
