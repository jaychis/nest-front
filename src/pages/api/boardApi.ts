import { client } from './client';
import { BoardType } from '../../_common/collectionTypes';
import { errorHandling } from '../../_common/errorHandling';

const BOARD_URL: string = 'boards';

interface ListParams {
  readonly take: number;
  readonly lastId?: string | null;
  readonly category?: string | null;
}

export const BoardListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `${BOARD_URL}/list?take=${take}`;

  if (lastId) URL += `&lastId=${lastId}`;
  if (category) URL += `&category=${category}`;
  const res = client.get(URL);

  return res;
};

interface BoardTagsListParams {
  readonly take: number;
  readonly lastId?: string | null;
  readonly category?: string | null;
  readonly userId: string;
}
export const BoardTagsRelatedAPI = ({
  take,
  lastId,
  category,
  userId,
}: BoardTagsListParams) => {
  let URL: string = `${BOARD_URL}/list/tags?take=${take}&userId=${userId}`;

  if (lastId) URL += `$lastId=${lastId}`;
  if (category) URL += `&category=${category}`;

  try {
    const res = client.get(URL);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'BoardTagsListAPI', error: e });
  }
};

export const BoardPopularListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `${BOARD_URL}/list/popular?take=${take}`;

  if (lastId) URL += `&lastId=${lastId}`;
  if (category) URL += `&category=${category}`;

  try {
    const res = client.get(URL);
    return res;
  } catch (e: any) {
    errorHandling({ text: 'BoardPopularListAPI', error: e });
  }
};

export const BoardShareListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `${BOARD_URL}/list/share?take=${take}`;

  if (lastId) URL += `&lastId=${lastId}`;
  if (category) URL += `&category=${category}`;

  try {
    const res = client.get(URL);
    return res;
  } catch (e: any) {
    errorHandling({ text: 'BoardShareListAPI', error: e });
  }
};

interface ReadParams {
  readonly id: string | null;
  readonly title: string | null;
}
export const ReadAPI = async (params: ReadParams) => {
  try {
    const URL: string = `${BOARD_URL}/read`;

    const res = await client.post(URL, params);
    console.log('READ API res : ', res);

    return res;
  } catch (e: any) {
    errorHandling({ text: 'BoardReadAPI', error: e });
  }
};

export interface SubmitParams {
  readonly category: string;
  readonly title: string;
  readonly content: string[];
  readonly userId: string;
  readonly nickname: string;
  readonly type: BoardType;
  readonly tags: string[];
  // readonly images: File[]; // 이미지 파일 배열
  // readonly videos: File[]; // 비디오 파일 배열
  // readonly links: string[]; // URL 배열
  // readonly youtubeLinks: string[]; // YouTube 링크 배열
}

export const BoardSubmitAPI = async (params: SubmitParams) => {
  const accessToken: string = localStorage.getItem('access_token') as string;
  const URL: string = `${BOARD_URL}/`;
  try {
    const res = await client.post(URL, params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (e: any) {
    errorHandling({ text: 'SubmitAPI error', error: e });
  }
};

export interface BoardInquiryParam {
  readonly id: string;
}

export const BoardInquiryAPI = async (param: BoardInquiryParam) => {
  const URL: string = `${BOARD_URL}/${param.id}`;

  const res = await client.get(URL);

  return res;
};

export const shareCountApi = async (id: string) => {
  try {
    const URL: string = `${BOARD_URL}/${id}/share-count`;
    const res = await client.patch(URL);
    return res;
  } catch (err) {
    console.error(err);
  }
};
