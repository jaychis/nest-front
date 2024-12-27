import React from 'react';
import { AWSImageRegistAPI, getPresignedUrlAPI } from '../pages/api/awsApi';

type ImageLocalPreviewUrlsInputType = {
  readonly event: React.ChangeEvent<HTMLInputElement>;
};
export type ImageLocalPreviewUrlsReturnType = {
  readonly previewUrls: string[];
  readonly fileList: File[];
} | null;
export const ImageLocalPreviewUrls = async ({
  event,
}: ImageLocalPreviewUrlsInputType): Promise<ImageLocalPreviewUrlsReturnType> => {
  if (!event.target.files) return null;
  const files: File[] = Array.from(event.target.files);

  if (files.length === 0) {
    alert('이미지를 선택해주세요.');
    return null;
  }

  const previewUrls: string[] = files.map((file: File) =>
    URL.createObjectURL(file),
  );
  console.log('previewUrls : ', previewUrls);

  return {
    fileList: files,
    previewUrls,
  };
};

type ImageLocalPreviewUrlsDelete = {
  readonly urls: string[];
};
export type ImageLocalPreviewUrlsDeleteType = string[] | null;
export const ImageLocalPreviewUrlsDelete = async ({
  urls,
}: ImageLocalPreviewUrlsDelete): Promise<ImageLocalPreviewUrlsDeleteType> => {
  if (urls.length === 0) {
    alert('삭제할 이미지가 없습니다.');
    return null;
  }

  return [];
};

type AwsImageUploadFunctionalityInputType = {
  readonly fileList: File[];
};
export type AwsImageUploadFunctionalityReturnType = {
  readonly imageUrls: string[];
} | null;
export const AwsImageUploadFunctionality = async ({
  fileList,
}: AwsImageUploadFunctionalityInputType): Promise<AwsImageUploadFunctionalityReturnType> => {
  const files: File[] = Array.from(fileList);

  const uploadImageUrlList = files.map(async (file: File) => {
    try {
      const sanitizedFileName: string = encodeURIComponent(file.name);
      const key = `uploads/${new Date().toISOString()}_${sanitizedFileName}`;
      const expires = 60;

      const res = await getPresignedUrlAPI({ key, expires });

      if (res.data && res.data.response && res.data.response.url) {
        const presignedUrl = res.data.response.url;

        const uploadResult = await AWSImageRegistAPI({
          url: presignedUrl,
          file,
        });

        if (uploadResult.ok) {
          const imageUrl = presignedUrl.split('?')[0];

          return imageUrl;
        } else {
          const errorText = await uploadResult.clone().text();
          console.error(
            'Failed to upload file: ',
            uploadResult.status,
            uploadResult.statusText,
            errorText,
          );
        }
      } else {
        console.error('Failed to get presigned URL');
      }
    } catch (error) {
      console.error('Error during file upload: ', error);
    }
  });

  try {
    const imageUrls: string[] = await Promise.all(uploadImageUrlList);

    for (let i: number = 0; i < imageUrls.length; ++i)
      if (!imageUrls[i]) {
        console.log('imageUrls 값이 없음');
        return null;
      }

    return { imageUrls };
  } catch (e: any) {
    console.log('Error during uploading all files : ', e);
    return null;
  }
};
