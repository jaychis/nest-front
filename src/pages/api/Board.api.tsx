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

  console.log("URL : ", URL);

  const res = client.get(URL);
  console.log("res : ", res);
  return res;
};
