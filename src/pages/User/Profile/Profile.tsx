import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { UsersGetJoinedCommunities, UsersProfileAPI } from '../../api/userApi';
import { ProfileState } from '../../../reducers/profileSlice';
import {
  CardType,
  CommunityType,
  MainListTypes,
  UserType,
} from '../../../_common/collectionTypes';
import Card from '../../../components/Card/Card';
import BoardComment, { CommentType } from '../../Board/BoardRead/BoardComment';
import { BoardInquiryAPI, BoardDelete } from '../../api/boardApi';
import { CommentUsersInquiryAPI } from '../../api/commentApi';
import {
  AwsImageUploadFunctionality,
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsDelete,
  DeleteImagePreviewUrlsResult,
  ImageLocalPreviewUrlsReturnType,
} from '../../../_common/imageUploadFuntionality';
import styled from 'styled-components';
import { breakpoints } from '../../../_common/breakpoint';
import TrashIcon from '../../../assets/img/trash.webp';
import SAVE from '../../../assets/img/save.png';
import { UsersProfilePictureAPI } from '../../api/usresProfileApi';
import DropDown from '../../../components/Dropdown';
import { useNavigate, useParams } from 'react-router-dom';
import { JAYCHIS_LOGO } from '../../../_common/jaychisLogo';
import { GetCommunitiesNameAPI } from '../../api/communityApi';
import { setCommunity } from '../../../reducers/communitySlice';
import PageTransition from '../../../components/PageTransition';
import Modal from '../../../components/Modal';
import BoardEdit from '../../Board/BoardRead/BoardEdit';

type ACTIVE_SECTION_TYPES = 'POSTS' | 'COMMENTS' | 'COMMUNITIES' | 'PROFILE';
const Profile = () => {
  const { userId } = useParams<{ readonly userId: string }>();
  const user: ProfileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [myPosts, setMyPosts] = useState<CardType[]>([]);
  const [myComments, setMyComments] = useState<CommentType[]>([]);
  const [myJoinedCommunities, setMyJoinedCommunities] = useState<
    CommunityType[]
  >([]);
  const [activeSection, setActiveSection] =
    useState<ACTIVE_SECTION_TYPES>('POSTS');
  const [profilePreview, setProfilePreview] = useState<string[]>([]);
  const [profileList, setProfileList] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user.data.nickname || '');
  const [email, setEmail] = useState<string>(user.data.email || '');
  const [dropdownisOpen, setDropdownIsOpen] = useState<boolean[]>([false]);
  const dropdownList: string[] = ['삭제하기', '수정하기'];
  const parentRef = useRef<HTMLDivElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string[]>([]);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number>(0);
  const navigate = useNavigate();

  interface CommunityClickType {
    readonly button: MainListTypes;
  }
  const handleCommunityClick = async (
    { button }: CommunityClickType,
    index: number,
  ) => {
    const communityName: string = button;

    const response = await GetCommunitiesNameAPI({ name: communityName });
    if (!response) return;

    const community = response.data.response;
    dispatch(setCommunity(community));
    navigate(`/j/${communityName}`);
  };

  const handleEdit = (item: string, index?: number) => {
    if (item === '삭제하기') {
      if (index === undefined) return;
      BoardDelete(myPosts[index].id, myPosts[index].nickname);
      alert('게시글이 삭제되었습니다.');
    } else if (item === '수정하기' && index !== undefined) {
      setEditContent(myPosts[index].content);
      setEditTitle(myPosts[index].title);
      setEditIndex(index);
      setModalIsOpen(true);
    }
  };

  const imageUrlListDelete = async () => {
    const res: DeleteImagePreviewUrlsResult = await ImageLocalPreviewUrlsDelete(
      { urls: profilePreview },
    );
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
    if (!userId) return;
    if (activeSection === 'POSTS') {
      const postsInquiry = async (): Promise<void> => {
        const res = await BoardInquiryAPI({ userId: userId });
        if (!res) return;
        const response = res.data.response;
        setMyPosts(response);
      };
      postsInquiry();
    }

    if (activeSection === 'COMMENTS') {
      const commentInquiry = async (): Promise<void> => {
        const res = await CommentUsersInquiryAPI({ userId: userId });
        if (!res) return;

        const response = res.data.response;

        setMyComments(response);
      };
      commentInquiry();
    }

    if (activeSection === 'COMMUNITIES') {
      const commentInquiry = async (): Promise<void> => {
        const res = await UsersGetJoinedCommunities();
        if (!res) return;

        const response = res.data.response;
        setMyJoinedCommunities(response);
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

          const userProfile = response.users_profile[0].profile_image;
          if (userProfile !== null) {
            setProfilePreview([userProfile]);
          }
        }
      };
      userInquiry();
    }
  }, [activeSection, userId, dispatch]);

  useEffect(() => {
    setDropdownIsOpen(Array(myPosts.length).fill(false));
  }, [myPosts]);

  const handleReplySubmit = (reply: any) => {
    // Implement reply submit logic here
  };

  return (
    <PageTransition>
      <Container>
        <Modal
          top={'10vh'}
          isOpen={modalIsOpen}
          onClose={() => {
            setModalIsOpen(false);
          }}
        >
          <BoardEdit
            setModalIsOpen={setModalIsOpen}
            editContent={editContent}
            editIndex={editIndex}
            editTitle={editTitle}
            setEditContent={setEditContent}
            setEditIndex={setEditIndex}
            setEditTitle={setEditTitle}
            myPosts={myPosts}
          />
        </Modal>

        <ButtonContainer>
          <SectionButton
            isActive={activeSection === 'POSTS'}
            onClick={() => setActiveSection('POSTS')}
          >
            등록한 게시글
          </SectionButton>
          <SectionButton
            isActive={activeSection === 'COMMENTS'}
            onClick={() => setActiveSection('COMMENTS')}
          >
            등록한 댓글
          </SectionButton>
          <SectionButton
            isActive={activeSection === 'COMMUNITIES'}
            onClick={() => setActiveSection('COMMUNITIES')}
          >
            가입한 커뮤니티
          </SectionButton>
          <SectionButton
            isActive={activeSection === 'PROFILE'}
            onClick={() => setActiveSection('PROFILE')}
          >
            정보
          </SectionButton>
        </ButtonContainer>

        {activeSection === 'POSTS' && (
          <Section>
            <SectionTitle>등록한 게시글</SectionTitle>
            {myPosts && myPosts.length > 0 ? (
              myPosts.map((post: CardType, index) => (
                <>
                  <div
                    ref={parentRef}
                    style={{
                      margin: '0 2% 0 auto',
                      width: '5%',
                      position: 'relative',
                    }}
                  >
                    <EditIcon
                      style={{ marginTop: '1%' }}
                      src="https://img.icons8.com/material-outlined/24/menu-2.png"
                      alt="menu-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownIsOpen((prev) =>
                          prev.map((state, idx) =>
                            idx === index ? !state : state,
                          ),
                        );
                      }}
                    />
                    {dropdownisOpen[index] && (
                      <DropDown
                        menu={dropdownList}
                        eventHandler={handleEdit}
                        eventIndex={index}
                        ref={parentRef}
                        onClose={() =>
                          setDropdownIsOpen((prev) =>
                            prev.map((state, idx) =>
                              idx === index ? false : state,
                            ),
                          )
                        }
                      />
                    )}
                  </div>
                  <Card
                    key={post?.id}
                    shareCount={post?.share_count}
                    createdAt={post?.created_at}
                    userId={post?.user_id}
                    {...post}
                  />
                </>
              ))
            ) : (
              <p>등록된 포스트가 없습니다.</p>
            )}
          </Section>
        )}

        {activeSection === 'COMMENTS' && (
          <Section>
            <SectionTitle>등록한 댓글</SectionTitle>
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

        {activeSection === 'COMMUNITIES' && (
          <Section>
            <SectionTitle>가입한 커뮤니티</SectionTitle>
            {myJoinedCommunities.length > 0 ? (
              myJoinedCommunities.map(
                (community: CommunityType, index: number) => (
                  <>
                    <CommunityContainer
                      onClick={() =>
                        handleCommunityClick(
                          {
                            button: community.name,
                          } as CommunityClickType,
                          index,
                        )
                      }
                    >
                      <CommunityPreviewWrapper>
                        <ImagePreview
                          src={community?.icon ? community.icon : JAYCHIS_LOGO}
                          alt="Profile Preview"
                        />
                      </CommunityPreviewWrapper>

                      <CommunityInfo>
                        <InfoRow>
                          <Label>커뮤니티명:</Label>
                          <Value>{community?.name}</Value>
                        </InfoRow>
                        <InfoRow>
                          <Label>공개범위:</Label>
                          <Value>{community?.visibility}</Value>
                        </InfoRow>
                      </CommunityInfo>
                    </CommunityContainer>
                  </>
                ),
              )
            ) : (
              <p>가입한 커뮤니티가 없습니다.</p>
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
                        <ImageIcon src={TrashIcon} alt="Trash Icon" />
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
              </ProfileInfo>
            </ProfileContainer>
          </Section>
        )}
      </Container>
    </PageTransition>
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

const CommunityContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 5px 0;
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

const CommunityPreviewWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  margin-right: 10px;
  cursor: pointer;
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

const CommunityInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
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

const EditIcon = styled.img`
  cursor: pointer;
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: 1000;
`;

export default Profile;
