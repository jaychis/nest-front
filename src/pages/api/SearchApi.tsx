import { client } from "./Client";

export interface SearchParam {
  readonly query: string;
}

export const GetSearchPeopleAPI = async (param: SearchParam) => {
  const URL: string = `searches/get/people/${param.query}`;

  const res = await client.get(URL);

  return res;
};

export const GetSearchMediaAPI = async (param: SearchParam) => {
  const URL: string = `searches/get/media/${param.query}`;
  console.log("GetSearchMediaAPI URL : ", URL);

  const res = await client.get(URL);

  return res;
};

export const GetSearchCommentsAPI = async (param: SearchParam) => {
  const URL: string = `searches/get/comments/${param.query}`;

  const res = await client.get(URL);

  return res;
};

export const GetSearchCommunitiesAPI = async (param: SearchParam) => {
  const URL: string = `searches/get/communities/${param.query}`;

  const res = await client.get(URL);

  return res;
};

export const GetSearchBoardsAPI = async (param: SearchParam) => {
  const URL: string = `searches/get/boards/${param.query}`;

  const res = await client.get(URL);

  return res;
};

export const AddSearchAPI = async (param: SearchParam) => {
  const URL: string = "searches/";

  const res = await client.post(URL, param);

  return res;
};

export const GetTopTenSearches = async () => {
  const URL: string = "searches/";

  const res = await client.get(URL);

  return res;
};
