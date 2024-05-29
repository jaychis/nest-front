import { client } from "./Client";

export interface AddSearchParam {
  readonly query: string;
}

export const AddSearchAPI = async (param: AddSearchParam) => {
  const URL: string = "searches/";

  const res = await client.post(URL, param);

  return res;
};

export const GetTopTenSearches = async () => {
  const URL: string = "searches/";

  const res = await client.get(URL);

  return res;
};
