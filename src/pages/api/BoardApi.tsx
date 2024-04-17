import { BACK_URL, client } from "./Client";

interface ListParams {
  readonly take: number;
  readonly lastId?: string | null;
  readonly category?: string | null;
}
export const ListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `${BACK_URL}/boards?take=${take}`;

  if (lastId) URL += `&lastId=${lastId}`;
  if (category) URL += `&category=${category}`;

  const res = client.get(URL);
  return res;
};

interface ReadParams {
  readonly id: string;
  readonly title: string;
}
export const ReadAPI = ({ id, title }: ReadParams) => {
  const URL: string = `${BACK_URL}/boards/read?id=${id}&title=${title}`;

  return client.get(URL);
};

export interface SubmitParams {
  readonly category: string;
  readonly title: string;
  readonly content: string;
  readonly identifierId: string;
  readonly nickname: string;
}
export const SubmitAPI = (params: SubmitParams) => {
  const URL: string = `${BACK_URL}/boards/`;

  const res = client.post(URL, params);
  return res;
};
