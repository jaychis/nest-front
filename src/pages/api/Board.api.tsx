import { BACK_URL, client } from "./Client";

interface ListParams {
  readonly take: number;
  readonly lastId?: string | null;
  readonly category?: string | null;
}
export const ListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `${BACK_URL}/boards?take=${take}`;

  if (lastId && category) {
    URL += `&lastId=${lastId}&category=${category}`;
  }

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
  console.log("res : ", res);
  return res;
};
