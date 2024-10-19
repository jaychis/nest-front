import { client } from './Client';
import { errorHandling } from '../../_common/ErrorHandling';

interface BoardTagsRegisterParams {
  readonly boardId: string;
  readonly tags: string[];
}
export const BoardTagsRegisterAPI = async (params: BoardTagsRegisterParams) => {
  const URL: string = `board/tags/`;

  try {
    const res = await client.post(URL, params);

    return res;
  } catch (e: any) {
    errorHandling(e);
  }
};

export const BoardTagsListAPI = () => {
  const URL: string = `board/tags/list`;

  try {
    const res = client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling(e);
  }
};
