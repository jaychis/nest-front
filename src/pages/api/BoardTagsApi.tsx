import { client } from './Client';
import { errorHandling } from '../../_common/ErrorHandling';

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
