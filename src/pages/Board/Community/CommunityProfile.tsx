import styled from 'styled-components';
import DropDown from '../../../components/Dropdown';
import { useState, useEffect } from 'react';
import React from 'react';
import {
  checkMembershipAPI, communityLogVisitAPI,
  CommunityUpdateAPI,
  CreateInvitationAPI,
  joinCommunityAPI,
  leaveCommunityAPI,
} from '../../api/communityApi';
import Modal from '../../../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import DragAndDrop from '../../../components/DragAndDrop';
import { AwsImageUploadFunctionalityReturnType } from '../../../_common/imageUploadFuntionality';
import { GetSearchPeopleAPI } from '../../api/searchApi';
import VIcon from '../../../assets/img/vicon.webp';
import {
  SelectCommunityMembersType,
  SelectCommunityParams,
  setJoinCommunity,
} from '../../../reducers/communitySlice';
import { breakpoints } from '../../../_common/breakpoint';

interface User {
  readonly nickname: string;
  readonly id: string[];
}

const CommunityProfile = () => {
  const USER_ID: string = localStorage.getItem('id') as string;
  const parentRef = React.useRef<HTMLDivElement>(null);
  const editButtonRef = React.useRef<HTMLDivElement>(null);
  const selectCommunity: SelectCommunityParams = useSelector(
    (state: any) => state.community,
  );

  const dispatch = useDispatch();
  const editList: string[] = [
    '이름 변경',
    '배경 변경',
    '프로필 변경',
    '초대하기',
    '강퇴처리하기',
  ];
  const [searchResultList, setSearchResultList] = useState<User[]>([]);
  const [editCommunityName, setEditCommunityName] = useState<string>('');
  const [editBackground, setEditBackground] = useState<
    AwsImageUploadFunctionalityReturnType | string
  >();
  const [editProfile, setEditProfile] = useState<
    AwsImageUploadFunctionalityReturnType | string
  >();
  const [editType, setEditType] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [inviteeNickname, setInviteeNickname] = useState<string>('');
  const logo = 'https://i.ibb.co/rHPPfvt/download.webp';

  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {

    const temp = [];

    for(let k of selectCommunity.members){
      temp.push(k.user_id)
    }

    if(temp.includes(USER_ID)) dispatch(setJoinCommunity({ is_joined: true }));
    else dispatch(setJoinCommunity({ is_joined: false }));
    
  }, [selectCommunity]);
  
  useEffect(() => {
    if (localStorage.getItem('id') && localStorage.getItem('nickname')) {
      const communityLogVisit = async () => {
        const response = await communityLogVisitAPI({communityId: selectCommunity.id})
        if (!response) return
        
        const res = response.data.response
      }

      communityLogVisit()
    }
  }, []);

  const communityEditHandler = (item: string) => {
    setEditType(item);
    handleModal();
    setView(false);
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleJoinedButtonClick = async () => {
    const communityId: string = selectCommunity.id;

    setIsLoading(true);
    try {
      const status = await checkMembershipAPI({
        communityId,
      });
      if (!status) return;

      const { is_joined } = status.data.response;

      if (is_joined) {
        const leaveStatus = await leaveCommunityAPI({ communityId });
        if (!leaveStatus) return;

        const { delete_member } = leaveStatus.data.response;

        dispatch(setJoinCommunity({ is_joined: false }));
      } else {
        const joinStatus = await joinCommunityAPI({ communityId });
        if (!joinStatus) return;

        const join = joinStatus.data.response;

        dispatch(setJoinCommunity({ is_joined: true }));
      }
    } catch (error) {
      console.error(
        `Failed to ${selectCommunity.is_joined ? 'leave' : 'join'} community:`,
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    try {
      if (value) {
        const res = await GetSearchPeopleAPI({ query: value });

        if (res && res.data && res.data.response) {
          setSearchResultList(
            res.data.response.map((user: User) => ({
              nickname: user.nickname,
              id: user.id,
            })),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeInviteeNickname = async ({
    inviteeNickname,
  }: {
    readonly inviteeNickname: string;
  }) => {
    setInviteeNickname(inviteeNickname);
  };
  const createCommunityInvitation = async () => {
    if (inviteeNickname === '') return alert('초대할 사람을 선택해주세요.');

    const response = await CreateInvitationAPI({
      inviteeNickname,
      communityId: selectCommunity.id,
    });
    if (!response) return;

    const res = response.data.response;
  };

  return (
    <>
      <CommunityInfoContainer>
        <Modal isOpen={isOpen} onClose={handleModal} top={'20%'}>
          {/* onChange에서 dispatch를 이용해 selectCommunity의 값을 변경하지 않고  
            edit관련 변수들을 거쳐서 변경한 이유는 이름이나 배경사진을 변경하려다가
            취소하고 나오게 되면 onChange와 dispatch를 통해 변경된 상태가 화면에 적용돼
            새로고침을 하기 전까지 유저에게 보여지는 화면에는 커뮤니티의 이름이나 사진들이 변경된 것으로 보이게 되기 떄문에
            다른 변수를 통해 한번 거쳐감  */}
          <div style = {{height: '320px',width: '300px', marginBottom: '20px'}}>
          {editType === '이름 변경' && (
            <>
              <CommunityNameInput
                required
                type="text"
                id="communityName"
                placeholder="변경할 이름을 입력해주세요"
                onChange={(e) => setEditCommunityName(e.target.value)}
              />
              <SubmitButton
                onClick={() => {
                  CommunityUpdateAPI({
                    id: selectCommunity.id,
                    visibility: selectCommunity.visibility,
                    name: editCommunityName,
                  });
                  handleModal();
                  alert('커뮤니티 이름이 변경되었습니다.');
                }}
              >
                변경
              </SubmitButton>
            </>
          )}

          {editType === '배경 변경' && (
            <div style = {{height:"70%"}}>
              <DragAndDrop onFileChange={setEditBackground} />
              <SubmitButton
                onClick={() => {
                  CommunityUpdateAPI({
                    id: selectCommunity.id,
                    visibility: selectCommunity.visibility,
                    banner: editBackground as string,
                  });
                  handleModal();
                  alert('배경화면이 변경 되었습니다.');
                }}
              >
                변경
              </SubmitButton>
            </div>
          )}

          {editType === '프로필 변경' && (
            <div style = {{height:"70%"}}>
              <DragAndDrop onFileChange={setEditProfile} />
              <SubmitButton
                onClick={() => {
                  CommunityUpdateAPI({
                    id: selectCommunity.id,
                    visibility: selectCommunity.visibility,
                    icon: editProfile as string,
                  });
                  handleModal();
                  alert('프로필 사진이 변경 되었습니다.');
                  window.location.reload();
                }}
              >
                변경
              </SubmitButton>
            </div>
          )}

          {editType === '초대하기' && (
            <>
              <UserSearchInput
                placeholder="초대할 유저의 닉네임을 입력해주세요"
                onChange={handleUserSearchChange}
              />
              {searchResultList.length > 0 && (
                <SearchResultList>
                  {searchResultList.map((result, index) => (
                    <>
                      <SearchResultItem
                        key={index}
                        index={index}
                        onClick={() => {
                          console.log('createCommunityInvitation start');
                          handleChangeInviteeNickname({
                            inviteeNickname: result.nickname,
                          });
                        }}
                      >
                        {result.nickname}
                        <VCheckImg src={VIcon} />
                      </SearchResultItem>
                    </>
                  ))}
                </SearchResultList>
              )}
              <SubmitButton
                onClick={() => {
                  createCommunityInvitation();
                  handleModal();
                  alert('멤버가 변경 되었습니다.');
                }}
              >
                변경
              </SubmitButton>
            </>
          )}
          </div>
        </Modal>

        <ProfileCircle>
          <ProfileImage
            src={selectCommunity.icon === null ? logo : selectCommunity.icon}
            alt="Description"
          />
        </ProfileCircle>

        <CommunityNameWrapper>
          <CommunityName>{selectCommunity.name}</CommunityName>
        </CommunityNameWrapper>

        {USER_ID === selectCommunity.creator_user_id && (
          <>
            <EditWrapper
              ref={parentRef}
              onClick={() => {
                setView(!view);
              }}
            >
              <EditIcon
                src="https://img.icons8.com/material-outlined/24/menu-2.png"
                alt="menu-2"
              />

              {view && (
                <DropDown 
                menu={editList} 
                eventHandler={communityEditHandler}
                onClose = {() => {setView(false)}}
                ref={parentRef} 
                />
              )}
            </EditWrapper>

          </>
        )}

        <JoinButton
          onClick={handleJoinedButtonClick}
          // disabled={isLoading}
          isJoined={selectCommunity.is_joined}
        >
          {isLoading
            ? 'Loading...'
            : selectCommunity.is_joined
              ? '참여중'
              : '참여하기'}
        </JoinButton>
      </CommunityInfoContainer>
    </>
  );
};

const CommunityInfoContainer = styled.div`
  display: flex;
  top: 27vh;
  left: 20%;
  position: absolute;

  @media (max-width: ${breakpoints.mobile}) {
    top: 35vh;
    left: 5%;
  }
`;

const ProfileCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  display: flex;
  border: 2px solid black;

  @media (max-width: ${breakpoints.mobile}) {
    width: 75px;
    height: 75px;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 75px;
`;

const CommunityNameWrapper = styled.div`
  top: 40vh;
  display: flex;
  margin-top: 9vh;
  margin-left: 1vw;

  @media (max-width: ${breakpoints.mobile}) {
    margin-top: 3vh;
  }
`;

const CommunityName = styled.h1`
  font-size: 2em;
  color: #333;
`;

const JoinButton = styled.div<{ readonly isJoined: boolean }>`
  position: absolute;
  top: 11vh;
  left: 52vw;
  background-color: ${(props) => (props.isJoined ? '#cccccc' : '#0056d2')};
  color: #ffffff;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  text-align: center;
  outline: none;
  width: 55px;

  &:hover {
    background-color: ${(props) => (props.isJoined ? '#aaaaaa' : '#0041a8')};
  }

  &:active {
    background-color: #00378b;
  }

  @media (max-width: ${breakpoints.mobile}) {
    top: 5vh;
    left: 90vw;
  }
`;

const EditWrapper = styled.div`
  position: relative;
  top: 12vh;
  margin-left: 20vw;
  height: 20px;

  @media(max-width: ${breakpoints.mobile}){
  top: 5.5vh;
  margin-left: 1vw;
  }

  @media(min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}){
  top: 11.5vh;
  margin-left: 4vw;
  }

  @media(min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop}){
  top: 12vh;
  margin-left: 13vw;
  }
`;

const EditIcon = styled.img`
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

const CommunityNameInput = styled.input`
  flex: 1;
  width: 90%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f7f7f7;
  margin-top: 3vh;
`;

const SubmitButton = styled.button`
  width: 100px;
  padding: 10px 20px;
  background-color: #84d7fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 5vh;
  margin-left: 38%;
`;

const UserSearchInput = styled.input`
  border-radius: 25px;
  height: 25px;
  width: 100%;
  margin: 10px 0 0 4%;
`;

const SearchResultList = styled.ul`
  list-style-type: none;
  margin: 10px 0 0 4%;
  padding: 0;
  width: 100%;
`;

const SearchResultItem = styled.li<{ readonly index: number }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  background-color: ${(props) => (props.index % 2 === 0 ? '#f9f9f9' : '#fff')};
  width: 95%;
`;

const VCheckImg = styled.img`
  height: 20px;
  width: 20px;
  margin-left: auto;
`;

export default CommunityProfile;
