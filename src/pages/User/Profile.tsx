import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { ReduxProfileAPI, UsersProfileAPI } from '../api/userApi';
import { ProfileState } from '../../reducers/profileSlice';
import { CardType, UserType } from '../../_common/collectionTypes';
import Card from '../../components/Card';
import BoardComment, { CommentType } from '../Board/BoardComment';
import { BoardInquiryAPI } from '../api/boardApi';
import {
  CommentInquiryAPI,
  CommentUsersInquiryAPI,
  CommentUsersInquiryParam,
} from '../api/commentApi';
import {
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsReturnType,
} from '../../_common/imageUploadFuntionality';
import styled from 'styled-components';

type ACTIVE_SECTION_TYPES = 'POSTS' | 'COMMENTS' | 'PROFILE';
const Profile = () => {
  const user: ProfileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [myPosts, setMyPosts] = useState<CardType[]>([]);
  const [myComments, setMyComments] = useState<CommentType[]>([]);
  const [activeSection, setActiveSection] =
    useState<ACTIVE_SECTION_TYPES>('POSTS');
  const ID: string = (localStorage.getItem('id') as string) || '';
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user.data.nickname || '');
  const [email, setEmail] = useState<string>(user.data.email || '');
  const [phone, setPhone] = useState<string>(user.data.phone || '');

  useEffect(() => {
    if (activeSection === 'POSTS') {
      const postsInquiry = async (): Promise<void> => {
        const res = await BoardInquiryAPI({ userId: ID });
        if (!res) return;
        const response = res.data.response;
        setMyPosts(response);
      };
      postsInquiry();
    }

    if (activeSection === 'COMMENTS') {
      const commentInquiry = async (): Promise<void> => {
        const res = await CommentUsersInquiryAPI({ userId: ID });
        if (!res) return;

        const response = res.data.response;
        console.log('comments response : ', response);
        setMyComments(response);
      };
      commentInquiry();
    }

    if (activeSection === 'PROFILE') {
      const userInquiry = async (): Promise<void> => {
        const res = await UsersProfileAPI();
        if (!res) return;

        const response = res.data.response as UserType;
        console.log('userInquiry response : ', response);
        if (response) {
          setNickname(response.nickname);
          setEmail(response.email);
          setPhone(response.phone);
        }
      };
      userInquiry();
    }
  }, [activeSection, ID, dispatch]);

  useEffect(() => {
    if (profilePicture && typeof profilePicture !== 'string') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(profilePicture);
    } else if (typeof profilePicture === 'string') {
      setProfilePreview(profilePicture);
    } else {
      setProfilePreview(null);
    }
  }, [profilePicture]);

  const handleProfilePictureChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event: e,
    });
    if (!urls) return;
    setProfilePreview(urls.previewUrls[0]);
    setProfilePicture(urls.fileList[0]);
  };

  const handleReplySubmit = (reply: any) => {
    // Implement reply submit logic here
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <Container>
      <ButtonContainer>
        <SectionButton
          isActive={activeSection === 'POSTS'}
          onClick={() => setActiveSection('POSTS')}
        >
          내가 등록한 게시글
        </SectionButton>
        <SectionButton
          isActive={activeSection === 'COMMENTS'}
          onClick={() => setActiveSection('COMMENTS')}
        >
          내가 등록한 댓글
        </SectionButton>
        <SectionButton
          isActive={activeSection === 'PROFILE'}
          onClick={() => setActiveSection('PROFILE')}
        >
          나의 정보
        </SectionButton>
      </ButtonContainer>

      {activeSection === 'POSTS' && (
        <Section>
          <SectionTitle>내가 등록한 게시글</SectionTitle>
          {myPosts && myPosts.length > 0 ? (
            myPosts.map((post: CardType) => (
              <Card
                key={post?.id}
                shareCount={post?.share_count}
                createdAt={post?.created_at}
                {...post}
              />
            ))
          ) : (
            <p>등록된 포스트가 없습니다.</p>
          )}
        </Section>
      )}

      {activeSection === 'COMMENTS' && (
        <Section>
          <SectionTitle>내가 등록한 댓글</SectionTitle>
          {myComments.length > 0 ? (
            myComments.map((comment: CommentType) => (
              <BoardComment
                key={comment?.id}
                {...comment}
                onReplySubmit={handleReplySubmit}
              />
            ))
          ) : (
            <p>작성된 댓글이 없습니다.</p>
          )}
        </Section>
      )}

      {activeSection === 'PROFILE' && (
        <Section>
          <SectionTitle>프로필</SectionTitle>
          <ProfileContainer>
            <ImageUploadWrapper>
              {isEditing ? (
                <>
                  <HiddenFileInput
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                  <ImagePreviewWrapper
                    onClick={() =>
                      document.getElementById('profilePicture')?.click()
                    }
                  >
                    {profilePreview ? (
                      <ImagePreview
                        src={profilePreview}
                        alt="Profile Preview"
                      />
                    ) : (
                      <Placeholder>프로필</Placeholder>
                    )}
                  </ImagePreviewWrapper>
                </>
              ) : (
                <ImagePreviewWrapper>
                  {profilePreview ? (
                    <ImagePreview src={profilePreview} alt="Profile Preview" />
                  ) : (
                    <Placeholder>프로필</Placeholder>
                  )}
                </ImagePreviewWrapper>
              )}
            </ImageUploadWrapper>
            <ProfileInfo>
              <InfoRow>
                <Label>닉네임:</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                ) : (
                  <Value>{nickname || '닉네임을 입력하세요'}</Value>
                )}
              </InfoRow>
              <InfoRow>
                <Label>이메일:</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <Value>{email || '이메일을 입력하세요'}</Value>
                )}
              </InfoRow>
              <InfoRow>
                <Label>전화번호:</Label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  <Value>{phone || '전화번호를 입력하세요'}</Value>
                )}
              </InfoRow>
            </ProfileInfo>
          </ProfileContainer>
        </Section>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;

  padding: 20px;
  background-color: red;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  background-color: violet;
`;

const SectionButton = styled.button<{ isActive: boolean }>`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? '#007BFF' : '#333')};
  background-color: white;
  border-bottom: ${({ isActive }) => (isActive ? '2px solid #333' : 'none')};
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  //background-color: #fff;
  background-color: blue;
  max-width: 60%;
  max-height: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ImageUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 20px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewWrapper = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  font-size: 14px;
  color: #888;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
  font-size: 18px;
  width: 100px;
`;

const Value = styled.span`
  color: #555;
  font-size: 18px;
  flex: 1;
`;

const Input = styled.input`
  font-size: 18px;
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #ccc;
  flex: 1;
`;

export default Profile;
