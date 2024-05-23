import { client } from "./Client";

export interface GetPresignedUrlParams {
  readonly key: string;
  readonly expires?: number;
}

export const getPresignedUrlAPI = async (params: GetPresignedUrlParams) => {
  const URL: string = "s3/presigned-url";

  const res = await client.put(URL, params);

  return res;
};

export interface AWSImageRegistParams {
  readonly url: string;
  readonly file: File;
}

export const AWSImageRegistAPI = async ({
  url,
  file,
}: AWSImageRegistParams) => {
  const URL: string = url;
  console.log("URL : ", URL);
  console.log("file : ", file);

  try {
    const res = await client.put(URL, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    console.log("res : ", res);

    return res;
  } catch (e: any) {
    console.log("AWSImageRegistAPI err : ", e);
    throw e;
  }
};
