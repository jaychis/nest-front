import styled from 'styled-components';
import logo from '../../assets/img/panda_logo.png';
import DropDown from '../../components/Dropdown';
import { useState, useEffect } from 'react';
import React from 'react';
import {
  checkMembershipAPI,
  CommunityUpdateAPI,
  CreateInvitationAPI,
  joinCommunityAPI,
  leaveCommunityAPI,
} from '../api/communityApi';
import Modal from '../../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState, UserModalState } from '../../reducers/modalStateSlice';
import { RootState } from '../../store/store';
import DragAndDrop from '../../components/DragAndDrop';
import { AwsImageUploadFunctionalityReturnType } from '../../_common/imageUploadFuntionality';
import { GetSearchPeopleAPI } from '../api/searchApi';
import vCheck from '../../assets/img/v-check.png';
import { SelectCommunityParams } from '../../reducers/communitySlice';
interface User {
  readonly nickname: string;
  readonly id: string[];
}

const CommunityProfile = () => {
  const USER_ID: string = localStorage.getItem('id') as string;
  const dropDownRef = React.useRef<HTMLDivElement>(null);
  const editButtonRef = React.useRef<HTMLDivElement>(null);
  const selectCommunity: SelectCommunityParams = useSelector(
    (state: any) => state.community,
  );
  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
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
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const communityEditHandler = (item: string) => {
    setEditType(item);
    dispatch(setModalState(!modalState.modalState));
    handleModal();
    setView(false);
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
    dispatch(setModalState(!modalState.modalState));
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

        const leave = leaveStatus.data.response;
        setIsJoined(false);
      } else {
        const joinStatus = await joinCommunityAPI({ communityId });
        if (!joinStatus) return;

        const join = joinStatus.data.response;
        setIsJoined(true);
      }
    } catch (error) {
      console.error(
        `Failed to ${isJoined ? 'leave' : 'join'} community:`,
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
        console.log('handleUserSearchChange res : ', res);
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

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        editButtonRef.current &&
        dropDownRef.current &&
        !editButtonRef.current.contains(event.target) &&
        !dropDownRef.current.contains(event.target)
      ) {
        setView(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    console.log('res : ', res);
  };

  return (
    <>
      <CommunityInfoContainer>
        <Modal isOpen={isOpen} onClose={handleModal}>
          {/* onChange에서 dispatch를 이용해 selectCommunity의 값을 변경하지 않고  
            edit관련 변수들을 거쳐서 변경한 이유는 이름이나 배경사진을 변경하려다가
            취소하고 나오게 되면 onChange와 dispatch를 통해 변경된 상태가 화면에 적용돼
            새로고침을 하기 전까지 유저에게 보여지는 화면에는 커뮤니티의 이름이나 사진들이 변경된 것으로 보이게 되기 떄문에
            다른 변수를 통해 한번 거쳐감  */}

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
                  dispatch(setModalState(!modalState.modalState));
                  handleModal();
                  alert('커뮤니티 이름이 변경되었습니다.');
                }}
              >
                변경
              </SubmitButton>
            </>
          )}

          {editType === '배경 변경' && (
            <>
              <DragAndDrop onFileChange={setEditBackground} />

              <SubmitButton
                onClick={() => {
                  CommunityUpdateAPI({
                    id: selectCommunity.id,
                    visibility: selectCommunity.visibility,
                    banner: editBackground as string,
                  });
                  dispatch(setModalState(!modalState.modalState));
                  handleModal();
                  alert('배경화면이 변경 되었습니다.');
                }}
              >
                변경
              </SubmitButton>
            </>
          )}

          {editType === '프로필 변경' && (
            <>
              <DragAndDrop onFileChange={setEditProfile} />

              <SubmitButton
                onClick={() => {
                  CommunityUpdateAPI({
                    id: selectCommunity.id,
                    visibility: selectCommunity.visibility,
                    icon: editProfile as string,
                  });
                  dispatch(setModalState(!modalState.modalState));
                  handleModal();
                  alert('프로필 사진이 변경 되었습니다.');
                  window.location.reload();
                }}
              >
                변경
              </SubmitButton>
            </>
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
                        <VCheckImg src={vCheck} />
                      </SearchResultItem>
                    </>
                  ))}
                </SearchResultList>
              )}
              <SubmitButton
                onClick={() => {
                  createCommunityInvitation();
                  dispatch(setModalState(!modalState.modalState));
                  handleModal();
                  alert('멤버가 변경 되었습니다.');
                }}
              >
                변경
              </SubmitButton>
            </>
          )}
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
            <EditButton
              ref={editButtonRef}
              onClick={() => {
                setView(!view);
              }}
            >
              <EditIcon
                src="https://img.icons8.com/material-outlined/24/menu-2.png"
                alt="menu-2"
              />
            </EditButton>

            {view && (
              <DropDownElement ref={dropDownRef}>
                <DropDown menu={editList} eventHandler={communityEditHandler} />
              </DropDownElement>
            )}
          </>
        )}

        <JoinButton
          onClick={handleJoinedButtonClick}
          // disabled={isLoading}
          isJoined={isJoined}
        >
          {isLoading ? 'Loading...' : isJoined ? '참여중' : '참여하기'}
        </JoinButton>
      </CommunityInfoContainer>
    </>
  );
};

const CommunityInfoContainer = styled.div`
  display: flex;
  top: 35vh;
  left: 25%;
  position: absolute;
`;

const ProfileCircle = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  display: flex;
  border: 2px solid black;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 75px;
`;

const CommunityNameWrapper = styled.div`
  top: 40vh;
  display: flex;
  margin-top: 14vh;
`;

const CommunityName = styled.h1`
  font-size: 2em;
  color: #333;
`;

const JoinButton = styled.div<{ isJoined: boolean }>`
  position: absolute;
  top: 18vh;
  left: 50vw;
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
`;

const EditButton = styled.div`
  position: absolute;
  top: 18vh;
  left: 45vw;
`;

const EditIcon = styled.img`
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

const DropDownElement = styled.div`
  position: absolute;
  top: 20vh;
  left: 47.5vw;
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
  width: 90%;
  margin: 10px 0 0 4%;
`;

const SearchResultList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SearchResultItem = styled.li<{ index: number }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  background-color: ${(props) => (props.index % 2 === 0 ? '#f9f9f9' : '#fff')};
  width: 90%;
`;

const VCheckImg = styled.img`
  height: 20px;
  width: 20px;
  margin-left: auto;
`;

export default CommunityProfile;
