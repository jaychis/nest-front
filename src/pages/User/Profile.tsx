import React, { useEffect, useState, ChangeEvent, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { ReduxProfileAPI } from '../api/userApi';
import { ProfileState } from '../../reducers/profileSlice';
import { CardType } from '../../_common/collectionTypes';
import Card from '../../components/Card';
import BoardComment, { CommentType } from '../Board/BoardComment';
import { BoardInquiryAPI } from '../api/boardApi';
import { CommentInquiryAPI } from '../api/commentApi';
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
      ExecuteBoardInquiryAPI({ id: ID }).then((res) => setMyPosts(res));
    }

    if (activeSection === 'COMMENTS') {
      const commentInquiry = async (): Promise<void> => {
        const res = await CommentInquiryAPI(ID);
        if (!res) return;

        const response = res.data.response;
        setMyComments(response);
      };
      commentInquiry();
    }

    if (activeSection === 'PROFILE') {
      dispatch(ReduxProfileAPI({ id: ID })).then((res) => {
        console.log('Profile API response:', res);
        if (res && res.payload) {
          setNickname(res.payload.nickname);
          setEmail(res.payload.email);
          setPhone(res.payload.phone);
        }
      });
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
      <Content>
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
                      <ImagePreview
                        src={profilePreview}
                        alt="Profile Preview"
                      />
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
            <EditButton onClick={isEditing ? handleSave : handleEditToggle}>
              {isEditing ? '저장' : '수정'}
            </EditButton>
          </Section>
        )}
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
`;

const Content = styled.div`
  flex: 2;
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
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
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const EditButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  font-weight: bold;
`;

const cache: { [key: string]: any } = {};

const exponentialBackoff = (retryCount: number): Promise<void> => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.pow(2, retryCount) * 1000),
  );
};

async function ExecuteBoardInquiryAPI({ id }: { readonly id: string }) {
  const URL = `boards/${id}`;

  if (cache[URL]) {
    return cache[URL];
  }

  let retryCount = 0;
  const maxRetries = 5;

  while (retryCount < maxRetries) {
    try {
      const res = await BoardInquiryAPI({ id });
      const response = res.data.response;
      console.log('profile board inquiry api response : ', response);

      cache[URL] = response;

      return response;
    } catch (e: any) {
      if (e.response && e.response.status === 429) {
        retryCount++;
        console.warn(`Retry ${retryCount} for ${URL} after 429 error.`);
        await exponentialBackoff(retryCount);
      } else if (e.response && e.response.status === 401) {
        console.error('Unauthorized error. Redirecting to login.');
        window.location.href = '/login'; // Adjust this to your login route
        return;
      } else {
        console.error('PROFILE BOARD INQUIRY ERROR : ', e);
        return []; // Return an empty array on error
      }
    }
  }

  console.error('Max retries reached. Returning empty response.');
  return [];
}

export default Profile;
