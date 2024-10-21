import { errorHandling } from '../../_common/ErrorHandling';
import { client } from './Client';

const CommunityTagsURL: string = 'community/tags';
export interface CommunityTagsSubmitParams {
  readonly tags: string[];
  readonly communityId: string;
}

export const CommunityTagsSubmitAPI = async (
  params: CommunityTagsSubmitParams,
) => {
  try {
    const URL: string = `${CommunityTagsURL}/`;

    const res = await client.post(URL, params);
    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommunityTagsSubmitAPI', error: e });
  }
};

export interface CommunityTagsReadParams {
  readonly tagId: string;
  readonly communityId: string;
}

export const CommunityTagsReadAPI = async ({
  tagId,
  communityId,
}: CommunityTagsReadParams) => {
  try {
    const URL: string = `${CommunityTagsURL}?tagId=${tagId}&communityId=${communityId}`;

    const res = await client.get(URL);
    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommunityTagsReadAPI', error: e });
  }
};

export interface CommunityTagsDeleteParams {
  readonly tagId: string;
  readonly communityId: string;
}

export const CommunityTagsDeleteAPI = async (
  params: CommunityTagsDeleteParams,
) => {
  try {
    const URL: string = `${CommunityTagsURL}/`;

    const config = {
      method: 'delete',
      url: URL,
      data: params,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await client.delete(URL, config);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'CommunityTagsDeleteAPI', error: e });
  }
};
