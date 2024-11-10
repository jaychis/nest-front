import { client } from './client';
import { errorHandling } from '../../_common/errorHandling';
import { sortTypes } from '../Search/SearchList';

const SearchesURL: string = 'searches';
export interface SearchParam {
  readonly query: string;
}

export interface SearchQueryAndSortTypeParams {
  readonly query: string;
  readonly sortType: sortTypes;
}

// Cache to store fetched data
const cache: { [key: string]: any } = {};

export const GetSearchPeopleAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/people/${param.query}`;
    if (cache[URL]) return cache[URL]; // Return cached response if available

    const res = await client.get(URL);
    cache[URL] = res; // Cache the response
    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetSearchPeopleAPI', error: e });
  }
};

export const GetSearchMediaAPI = async (
  params: SearchQueryAndSortTypeParams,
) => {
  try {
    const URL: string = `${SearchesURL}/get/media?query=${params.query}&sortType=${params.sortType}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetSearchMediaAPI', error: e });
  }
};

export const GetSearchCommentsAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/comments/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetSearchCommentsAPI', error: e });
  }
};

export const GetSearchCommunitiesAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/communities/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetSearchCommunitiesAPI', error: e });
  }
};

export const GetSearchBoardsAPI = async (
  params: SearchQueryAndSortTypeParams,
) => {
  try {
    const URL: string = `${SearchesURL}/get/boards?query=${params.query}&sortType=${params.sortType}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetSearchBoardsAPI', error: e });
  }
};

export const GetSearchTagsAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/get/tags/${param.query}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetSearchTagsAPI', error: e });
  }
};

export const AddSearchAPI = async (param: SearchParam) => {
  try {
    const URL: string = `${SearchesURL}/`;

    const res = await client.post(URL, param);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'AddSearchAPI', error: e });
  }
};

export const GetTopTenSearchesAPI = async () => {
  try {
    const URL: string = `${SearchesURL}/`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetTopTenSearchesAPI', error: e });
  }
};
