import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { UsersProfileAPI } from '../api/userApi';
import { ProfileState } from '../../reducers/profileSlice';
import { CardType, UserType } from '../../_common/collectionTypes';
import Card from '../../components/Card';
import BoardComment, { CommentType } from '../Board/BoardComment';
import { BoardInquiryAPI } from '../api/boardApi';
import { CommentUsersInquiryAPI } from '../api/commentApi';
import {
  AwsImageUploadFunctionality,
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsDelete,
  ImageLocalPreviewUrlsDeleteType,
  ImageLocalPreviewUrlsReturnType,
} from '../../_common/imageUploadFuntionality';
import styled from 'styled-components';
import { breakpoints } from '../../_common/breakpoint';
import TRASH from '../../assets/img/trash.png';
import SAVE from '../../assets/img/save.png';
import { UsersProfilePictureAPI } from '../api/usresProfileApi';

type ACTIVE_SECTION_TYPES = 'POSTS' | 'COMMENTS' | 'PROFILE';
const Profile = () => {
  const user: ProfileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [myPosts, setMyPosts] = useState<CardType[]>([]);
  const [myComments, setMyComments] = useState<CommentType[]>([]);
  const [activeSection, setActiveSection] =
    useState<ACTIVE_SECTION_TYPES>('POSTS');
  const ID: string = (localStorage.getItem('id') as string) || '';
  const [profilePreview, setProfilePreview] = useState<string[]>([]);
  const [profileList, setProfileList] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user.data.nickname || '');
  const [email, setEmail] = useState<string>(user.data.email || '');
  const [phone, setPhone] = useState<string>(user.data.phone || '');

  const imageUrlListDelete = async () => {
    const res: ImageLocalPreviewUrlsDeleteType =
      await ImageLocalPreviewUrlsDelete({ urls: profilePreview });
    if (!res) return;

    setProfilePreview(res);
  };

  const handleProfilePictureChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event: e,
    });
    if (!urls) return;

    setProfilePreview(urls.previewUrls);
    setProfileList(urls.fileList);
  };

  const profileImageSave = async () => {
    const profileImageList = await AwsImageUploadFunctionality({
      fileList: profileList,
    });
    const profileImage =
      profileImageList === null ? null : profileImageList.imageUrls[0];

    const response = await UsersProfilePictureAPI({ profileImage });
    if (!response) return;

    const res = response.data.response.profile_image;

    res === null ? setProfilePreview([]) : setProfilePreview([res]);
  };

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

        setMyComments(response);
      };
      commentInquiry();
    }

    if (activeSection === 'PROFILE') {
      const userInquiry = async (): Promise<void> => {
        const res = await UsersProfileAPI();
        if (!res) return;

        const response = res.data.response as UserType;
        if (response) {
          setNickname(response.nickname);
          setEmail(response.email);
          setPhone(response.phone);

          const userProfile = response.users_profile[0].profile_image;
          if (userProfile !== null) {
            setProfilePreview([userProfile]);
          }
        }
      };
      userInquiry();
    }
  }, [activeSection, ID, dispatch]);

  const handleReplySubmit = (reply: any) => {
    // Implement reply submit logic here
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
              <HiddenFileInput
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />

              <ImagePreviewWrapper
                onClick={() => {
                  document.getElementById('profilePicture')?.click();
                }}
              >
                <SaveButton
                  onClick={(e) => {
                    e.stopPropagation();
                    profileImageSave();
                  }}
                >
                  <ImageIcon src={SAVE} alt={'Save Icon'} />
                </SaveButton>
                {profilePreview.length > 0 ? (
                  <>
                    <ImagePreview
                      src={profilePreview[0]}
                      alt="Profile Preview"
                    />

                    <TrashButton
                      onClick={(e) => {
                        e.stopPropagation();
                        imageUrlListDelete();
                      }}
                    >
                      <ImageIcon src={TRASH} alt="Trash Icon" />
                    </TrashButton>
                  </>
                ) : (
                  <Placeholder>프로필</Placeholder>
                )}
              </ImagePreviewWrapper>
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}) {
    margin-left: 0;
    max-width: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SectionButton = styled.button<{ readonly isActive: boolean }>`
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
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
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

  position: relative;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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

const TrashButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 2px;
  right: -2px;
`;

const SaveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 2px;
  left: -2px;
`;

const ImageIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

export default Profile;
