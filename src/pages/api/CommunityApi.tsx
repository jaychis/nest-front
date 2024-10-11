import { client } from "./Client";
import { ErrorHandling } from "../../_common/ErrorHandling";
import { CommunityVisibilityType } from "../../_common/CollectionTypes";

const COMMUNITY_URL: string = "communities";

interface GetCommunitiesNameParam {
  readonly name: string;
}

export const GetCommunitiesNameAPI = async ({
  name,
}: GetCommunitiesNameParam) => {
  try {
    const URL: string = `${COMMUNITY_URL}/get/communities/name/${name}`;

    const res = await client.get(URL);
    console.log(res)
    return res;
  } catch (e: any) {
    ErrorHandling({ text: "GetSearchCommunitiesNameAPI", error: e });
  }
};

export interface CommunitySubmitParams {
  readonly name: string;
  readonly description: string;
  readonly visibility?: CommunityVisibilityType;
  readonly banner?: string | null ;
  readonly icon?: string | null ;
  readonly userIds?: string[];
}

export const CommunitySubmitAPI = async (params: CommunitySubmitParams) => {
  const accessToken:string = localStorage.getItem('access_token') as string
  try {
    const URL: string = `${COMMUNITY_URL}`;

    const res = await client.post(URL, params,
      {headers : {
        Authorization: `Bearer ${accessToken}`
    }}
    );

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommunitySubmitAPI", error: e });
  }
};

export interface CommunityListParams {
  readonly page: number;
  readonly take: number;
  readonly id?: string;
}

export const CommunityListAPI = async ({ page, take,id }: CommunityListParams) => {
  try {
    const URL: string = `${COMMUNITY_URL}?take=${take}&page=${page}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommunityListAPI", error: e });
  }
};

export interface CommunityReadParam {
  readonly id: string;
}

export const CommunityReadAPI = async ({ id }: CommunityReadParam) => {
  try {
    const URL: string = `${COMMUNITY_URL}/${id}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommunityReadAPI", error: e });
  }
};

export interface CommunityDeleteParam {
  readonly id: string;
}

export const CommunityDeleteAPI = async (param: CommunityDeleteParam) => {
  try {
    const URL: string = `${COMMUNITY_URL}/delete`;

    const res = await client.patch(URL, param);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommunityDeleteAPI", error: e });
  }
};

export interface CommunityUpdateParams {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon?: string;
  readonly banner?: string;
}

export const CommunityUpdateAPI = async (params: CommunityUpdateParams) => {
  try {
    const URL: string = `${COMMUNITY_URL}/`;

    const res = await client.patch(URL, params);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "CommunityUpdateAPI", error: e });
  }
};
