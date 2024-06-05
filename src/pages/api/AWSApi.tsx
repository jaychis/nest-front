import { client } from "./Client";

export interface GetPresignedUrlParams {
  readonly key: string;
  readonly expires?: number;
}

export const getPresignedUrlAPI = async (params: GetPresignedUrlParams) => {
  try {
    const URL: string = "s3/presigned-url";
    console.log("URL : ", URL);

    const res = await client.post(URL, params);
    console.log("getPresignedUrlAPI res : ", res);

    return res;
  } catch (e: any) {
    console.error("getPresignedUrlAPI error : ", e);
    throw new Error(`${e}`);
  }
};

export interface AWSImageDeleteParams {
  readonly urls: string[];
}

export const AWSImageDeleteAPI = async ({ urls }: AWSImageDeleteParams) => {
  const URL: string = "s3/";
  console.log("URL : ", URL);
  console.log("urls : ", urls);
  const keys: string[] = urls.map((url: string) => url.split(".com/")[1]); // URL에서 파일 경로 추출
  console.log("keys : ", keys);

  const param: { keys: string[] } = {
    keys,
  };

  try {
    const res = await client.delete(URL, { data: param });

    return res;
  } catch (e: any) {
    console.log("AWSImageDeleteAPI err : ", e);
    throw e;
  }
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
    const res = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "x-amz-acl": "public-read",
      },
      body: file,
    });
    console.log("res : ", res);

    return res;
  } catch (e: any) {
    console.log("AWSImageRegistAPI err : ", e);
    throw e;
  }
};
