import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsReturnType,
} from '../_common/imageUploadFuntionality';
import { UsersProfileType } from '../_common/collectionTypes';

interface UserSearchCardParams {
  readonly nickname: string;
  readonly email?: string;
  readonly profileImage: UsersProfileType[];
}

const UserSearchCard = ({
  nickname,
  email,
  profileImage,
}: UserSearchCardParams) => {
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);

  useEffect(() => {
    console.log('UserSearchCard');
    console.log('profileImage : ', profileImage);
  }, []);

  const handleProfilePictureChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event: e,
    });
    if (!urls) return;
    setProfilePreview(urls.previewUrls[0]);
  };

  return (
    <CardContainer
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      isHovered={isCardHovered}
      modalState={true}
    >
      <UserInfo>
        <ImageUploadWrapper>
          <HiddenFileInput
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
          <ImagePreviewWrapper>
            <ImagePreview
              src={profileImage[0].profile_image || profilePreview || undefined}
              alt="Profile Preview"
            />
          </ImagePreviewWrapper>
        </ImageUploadWrapper>

        <InformationContainer>
          <Username>{nickname}</Username>
          <EmailInfo>{email}</EmailInfo>
        </InformationContainer>
      </UserInfo>
    </CardContainer>
  );
};

export default UserSearchCard;

const CardContainer = styled.div<{
  readonly isHovered: boolean;
  readonly modalState: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #f5f7fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  z-index: ${(props) => (props.modalState ? -10 : 999)};
  width: 90%;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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