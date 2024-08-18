import { client } from "./Client";
import { BoardType } from "../../_common/CollectionTypes";
import { ErrorHandling } from "../../_common/ErrorHandling";

interface ListParams {
  readonly take: number;
  readonly lastId?: string | null;
  readonly category?: string | null;
}
export const ListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `boards/list?take=${take}`;

  if (lastId) URL += `&lastId=${lastId}`;
  if (category) URL += `&category=${category}`;

  const res = client.get(URL);
  return res;
};

export const AllListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `boards/list/all?take=${take}`;

  if (lastId) URL += `&lastId=${lastId}`;
  if (category) URL += `&category=${category}`;

  const res = client.get(URL);
  return res;
};

export const PopularListAPI = ({ take, lastId, category }: ListParams) => {
  let URL: string = `boards/list/all?take=${take}`;

  if (lastId) URL += `&lastId=${lastId}`;
  if (category) URL += `&category=${category}`;

  const res = client.get(URL);
  return res;
};

interface ReadParams {
  readonly id: string;
  readonly title: string;
}
export const ReadAPI = (params: ReadParams) => {
  try {
    const URL: string = `boards/read`;

    const res = client.post(URL, params);
    console.log("READ API res : ", res);

    return res;
  } catch (e: any) {
    ErrorHandling({ text: "BoardReadAPI", error: e });
  }
};

export interface SubmitParams {
  readonly category: string;
  readonly title: string;
  readonly content: string[];
  readonly identifierId: string;
  readonly nickname: string;
  readonly type: BoardType;
  // readonly images: File[]; // 이미지 파일 배열
  // readonly videos: File[]; // 비디오 파일 배열
  // readonly links: string[]; // URL 배열
  // readonly youtubeLinks: string[]; // YouTube 링크 배열
}

export const SubmitAPI = async (params: SubmitParams) => {
  const URL: string = `boards/`;

  const res = await client.post(URL, params);
  return res;
};

export interface BoardInquiryParam {
  readonly id: string;
}

export const BoardInquiryAPI = async (param: BoardInquiryParam) => {
  const URL: string = `boards/${param.id}`;

  const res = await client.get(URL);

  return res;
};
