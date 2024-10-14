import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import {
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsReturnType,
} from '../_common/ImageUploadFuntionality';

interface UserSearchCardParams {
  readonly nickname: string;
  readonly email: string;
  readonly profileImage: null | string;
}

const UserSearchCard = ({
  nickname,
  email,
  profileImage,
}: UserSearchCardParams) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const handleProfilePictureChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event: e,
    });
    if (!urls) return;
    setProfilePreview(urls.previewUrls[0]);
    // setProfilePicture(urls.fileList[0]);
  };
  return (
    <CardContainer>
      <UserInfo>
        <ImageUploadWrapper>
          <HiddenFileInput
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
          <ImagePreviewWrapper
            onClick={() => document.getElementById('profilePicture')?.click()}
          >
            {profilePreview ? (
              <ImagePreview src={profilePreview} alt="Profile Preview" />
            ) : (
              <Placeholder>프로필</Placeholder>
            )}
          </ImagePreviewWrapper>
        </ImageUploadWrapper>

        <Username>{nickname}</Username>
      </UserInfo>
      <EmailInfo>{email}</EmailInfo>
    </CardContainer>
  );
};

export default UserSearchCard;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #f5f7fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  font-family: Arial, sans-serif;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.h3`
  font-size: 18px;
  margin: 0;
  color: #333;
`;

const EmailInfo = styled.a`
  font-size: 14px;
  color: #0066cc;
  text-decoration: none;
  margin-top: 10px;
  word-break: break-all;
  margin-left: 110px;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 20px;
`;

const ImagePreviewWrapper = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Placeholder = styled.div`
  font-size: 14px;
  color: #888;
`;
