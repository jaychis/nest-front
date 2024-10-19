import { errorHandling } from '../../_common/ErrorHandling';
import { client } from './Client';

const TagURL: string = 'tags';
export const TagListAPI = async () => {
  try {
    const URL: string = `${TagURL}/`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'TagListAPI', error: e });
  }
};
