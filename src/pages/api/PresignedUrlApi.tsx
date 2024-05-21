import { client } from "./Client";

export interface GetPresignedUrlParams {
  readonly key: string;
  readonly expired?: number;
}

export const getPresignedUrlAPI = async (params: GetPresignedUrlParams) => {
  const URL: string = "s3/presigned-url";

  const res = await client.post(URL, params);

  return res;
};
