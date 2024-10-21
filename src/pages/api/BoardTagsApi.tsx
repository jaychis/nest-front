import { client } from './Client';
import { errorHandling } from '../../_common/ErrorHandling';

const BoardTagsURL: string = 'board/tags/';

interface BoardTagsRegisterParams {
  readonly boardId: string;
  readonly tags: string[];
}
export const BoardTagsRegisterAPI = async (params: BoardTagsRegisterParams) => {
  const URL: string = BoardTagsURL;

  try {
    const res = await client.post(URL, params);

    return res;
  } catch (e: any) {
    errorHandling(e);
  }
};

export const BoardTagsListAPI = () => {
  const URL: string = BoardTagsURL;

  try {
    const res = client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling(e);
  }
};
