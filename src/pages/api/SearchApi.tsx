import { client } from "./Client";
import { ErrorHandling } from "../../_common/ErrorHandling";

const SearchesURL: string = "searches";
export interface SearchParam {
  readonly query: string;
}

export const GetSearchPeopleAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/people/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "GetSearchPeopleAPI", error: e });
  }
};

export const GetSearchMediaAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/media/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "GetSearchMediaAPI", error: e });
  }
};

export const GetSearchCommentsAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/comments/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "GetSearchCommentsAPI", error: e });
  }
};

export const GetSearchCommunitiesAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/communities/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "GetSearchCommunitiesAPI", error: e });
  }
};

export const GetSearchBoardsAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/boards/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "GetSearchBoardsAPI", error: e });
  }
};

export const AddSearchAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/`;

    const res = await client.post(URL, param);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "AddSearchAPI", error: e });
  }
};

export const GetTopTenSearchesAPI = async () => {
  try {
    const URL: string = `${SearchesURL}/`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "GetTopTenSearchesAPI", error: e });
  }
};
