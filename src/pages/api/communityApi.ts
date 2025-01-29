import { client } from './client';
import { errorHandling } from '../../_common/errorHandling';
import { CommunityVisibilityType } from '../../_common/collectionTypes';

const COMMUNITY_URL: string = 'communities';

interface GetCommunitiesNameParam {
  readonly name: string;
}

export const GetCommunitiesNameAPI = async ({
  name,
}: GetCommunitiesNameParam) => {
  try {
    const URL: string = `${COMMUNITY_URL}/get/communities/${name}`;

    const res = await client.get(URL);
    console.log(res);
    return res;
  } catch (e: any) {
    errorHandling({ text: 'GetSearchCommunitiesNameAPI', error: e });
  }
};

export interface CommunitySubmitParams {
  readonly name: string;
  readonly description: string;
  readonly visibility?: CommunityVisibilityType;
  readonly banner?: string | null;
  readonly icon?: string | null;
}

export const CommunitySubmitAPI = async (params: CommunitySubmitParams) => {
  const accessToken: string = localStorage.getItem('access_token') as string;
  try {
    const URL: string = `${COMMUNITY_URL}`;

    const res = await client.post(URL, params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommunitySubmitAPI', error: e });
  }
};

export interface CommunityListParams {
  readonly page: number;
  readonly take: number;
}

export const CommunityListAPI = async ({ page, take }: CommunityListParams) => {
  try {
    const URL: string = `${COMMUNITY_URL}?take=${take}&page=${page}`;

    const res = await client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommunityListAPI', error: e });
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
    errorHandling({ text: 'CommunityReadAPI', error: e });
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
    errorHandling({ text: 'CommunityDeleteAPI', error: e });
  }
};

export interface CommunityUpdateParams {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly banner?: string;
  readonly visibility: CommunityVisibilityType;
}

export const CommunityUpdateAPI = async (params: CommunityUpdateParams) => {
  try {
    const URL: string = `${COMMUNITY_URL}/`;

    const res = await client.patch(URL, params);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommunityUpdateAPI', error: e });
  }
};

export interface CreateInvitationParams {
  readonly communityId: string;
  readonly inviteeNickname: string;
}

export const CreateInvitationAPI = async ({
  communityId,
  inviteeNickname,
}: CreateInvitationParams) => {
  try {
    const URL: string = `${COMMUNITY_URL}/${communityId}/invitations`;

    const res = await client.post(URL, { inviteeNickname });

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CreateInvitationAPI', error: e });
  }
};

export interface JoinedParams {
  readonly communityId: string;
}

export const checkMembershipAPI = async ({ communityId }: JoinedParams) => {
  try {
    const response = await client.get(
      `${COMMUNITY_URL}/${communityId}/membership`,
    );
    return response;
  } catch (e: any) {
    errorHandling({ text: 'checkMembershipAPI', error: e });
  }
};

export const leaveCommunityAPI = async ({ communityId }: JoinedParams) => {
  try {
    const response = await client.post(`${COMMUNITY_URL}/${communityId}/leave`);
    return response;
  } catch (e: any) {
    errorHandling({ text: 'leaveCommunityAPI', error: e });
  }
};

export const joinCommunityAPI = async ({ communityId }: JoinedParams) => {
  try {
    const response = await client.post(
      `${COMMUNITY_URL}/${communityId}/join`,
      {},
    );
    return response;
  } catch (e: any) {
    errorHandling({ text: 'checkMembershipAPI', error: e });
  }
};

export const getRecentCommunitiesAPI = async () => {
  try {
    const response = await client.get(
      `${COMMUNITY_URL}/get/recent/communities`,
    );

    return response;
  } catch (e: any) {
    errorHandling({ text: 'getRecentCommunitiesAPI', error: e });
  }
};

interface CommunityLogVisitParam {
  readonly communityId: string
}
export const communityLogVisitAPI = async ({communityId}: CommunityLogVisitParam) => {
  try {
    const response = await client.get(`${COMMUNITY_URL}/log/visit?communityId=${communityId}`);

    return response;
  } catch (e: any) {
    errorHandling({ text: 'communityLogVisitAPI', error: e });
  }
};
