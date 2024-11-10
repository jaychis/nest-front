import { client } from './client';
import { errorHandling } from '../../_common/errorHandling';

const BoardTagsURL: string = 'board/tags/';

export const BoardTagsListAPI = () => {
  const URL: string = BoardTagsURL;

  try {
    const res = client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling(e);
  }
};
