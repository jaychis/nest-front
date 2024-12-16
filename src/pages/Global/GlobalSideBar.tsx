import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MainListTypes } from '../../_common/collectionTypes';
import { AppDispatch } from '../../store/store';
import { sideButtonSliceActions } from '../../reducers/mainListTypeSlice';
import {
  setCommunity,
  SelectCommunityParams,
} from '../../reducers/communitySlice';
import { RootState } from '../../store/store';
import { UserModalState } from '../../reducers/modalStateSlice';
import logo from '../../assets/img/panda_logo.png';
import { CommunityListAPI } from '../api/communityApi';
import Tooltip from '../../components/Tooltip';
import styled from 'styled-components';

interface HomeListProps {
  selectedButton?: string;
  isSideHovered: string | null;
}

const GlobalSideBar = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );
  const [isSideHovered, setIsSideHovered] = useState<
    MainListTypes | 'CREATE_COMMUNITY' | null
  >(null);
  const [selectedButton, setSelectedButton] = useState<MainListTypes>('HOME');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');

  const [communityList, setCommunityList] = useState<SelectCommunityParams[]>(
    [],
  );
  const [communityNamesSet, setCommunityNamesSet] = useState<Set<string>>(
    new Set(),
  );
  const [displayCount, setDisplayCount] = useState(5);

  const fetchCommunities = async (page: number) => {
    setLoading(true);
    const id = localStorage.getItem('id') as string;

    try {
      const res = await CommunityListAPI({ take: 10, page });
      if (!res) return;
      const response = res.data.response.current_list;
      const uniqueCommunities = response.filter(
        (community: SelectCommunityParams) => {
          if (communityNamesSet.has(community.name)) {
            return false;
          } else {
            communityNamesSet.add(community.name);
            return true;
          }
        },
      );
      setCommunityList((prevList) => [...prevList, ...uniqueCommunities]);
    } catch (err) {
      console.log('CommunityListAPI error: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities(page);
  }, [page]);

  useEffect(() => {
    const initialSet = new Set(
      communityList.map((community) => community.name),
    );
    setCommunityNamesSet(initialSet);
  }, [communityList]);

  const handleClick = (button: MainListTypes) => {
    if (button === 'TAGMATCH' && !(localStorage.getItem('id') as string)) {
      alert('회원가입 유저에게 제공되는 기능입니다.');

      return;
    }

    setSelectedButton(button);
    dispatch(sideButtonSliceActions.setButtonType(button));
  };

  interface CommunityClickType {
    button: MainListTypes;
  }
  const handleCommunityClick = (
    { button }: CommunityClickType,
    index: number,
  ) => {
    dispatch(sideButtonSliceActions.setButtonType(button));
    dispatch(setCommunity(communityList[index]));
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  const handleCreateCommunityClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    navigate('/community/create1');
  };

  return (
    <GlobalSideBarContainer isModalOpen={modalState.modalState}>

      <HomeList
        selectedButton={selectedButton}
        isSideHovered={isSideHovered}
        onMouseEnter={() => setIsSideHovered('HOME')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('HOME')}
      >
      <Tooltip
        image={'🏠'}
        title={'홈'}
        content={'사용자들이 좋아요를 많이 누른 랭킹순입니다.'}
      />
      </HomeList>

      <MostCommentedList
        selectedButton={selectedButton}
        isSideHovered={isSideHovered}
        onMouseEnter={() => setIsSideHovered('POPULAR')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('POPULAR')}
      >
        <Tooltip
          image={'🔥'}
          title={'실시간'}
          content={'사용자들이 댓글을 많이 단 랭킹입니다.'}
        />
      </MostCommentedList>

      <FrequentShareList
        selectedButton={selectedButton}
        isSideHovered={isSideHovered}
        onMouseEnter={() => setIsSideHovered('FREQUENTSHARE')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('FREQUENTSHARE')}
      >
        <Tooltip
          image={'🌐'}
          title={'퍼주기'}
          content={'사용자들이 많이 공유한 랭킹입니다.'}
        />
      </FrequentShareList>

      <TagMatchList
        selectedButton={selectedButton}
        isSideHovered={isSideHovered}
        onMouseEnter={() => setIsSideHovered('TAGMATCH')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => handleClick('TAGMATCH')}
      >
        <Tooltip
          image={'🌐'}
          title={'내가 좋아할 글'}
          content={'사용자가 좋아할 만한 태그를 가진 랭킹입니다.'}
        />
      </TagMatchList>
      
      <div style={{ fontWeight: 'bold', paddingLeft: '10px', fontSize: '1rem' }}>
        RECENT
      </div>
      <div style={{ padding: '5px 0 10px 10px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
        >
          <span style={{ fontSize: '1.3rem' }}>🇰🇷</span>
          <span style={{ marginLeft: '6px', fontSize: '1rem' }}>r/korea</span>
        </div>
      </div>
      

      <CommunitySection>커뮤니티</CommunitySection>

      <CreateCommunityItem
        isSideHovered={isSideHovered}
        onMouseEnter={() => setIsSideHovered('CREATE_COMMUNITY')}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={handleCreateCommunityClick}
      >
        <span style={{ marginRight: '10px' }}>➕</span>
        커뮤니티 만들기
      </CreateCommunityItem>

      <CommunityListContainer>
        {communityList.length > 0
          ? communityList
              .slice(0, displayCount)
              .map((community: SelectCommunityParams, index) => (
                <CommunityItem key={community.id || index}>
                  <CommunityIcon
                    src={logo}
                    alt={'community icon'}
                    onClick={() =>
                      handleCommunityClick(
                        {button: community.name,} as CommunityClickType,index,
                      )}
                  />
                  <CommunityName
                    onClick={() =>
                      handleCommunityClick(
                        {
                          button: community.name,
                        } as CommunityClickType,
                        index,
                      )
                    }
                  >
                    j/{community.name}
                  </CommunityName>
                </CommunityItem>
              ))
          : []}

        {communityList.length > displayCount && (
          <ButtonWrapper>
            <ShowMoreButton 
              onClick={handleLoadMore} 
              disabled={loading} 
              isLoading={loading}
            >
              {loading ? '로딩 중...' : '더 보기'}
            </ShowMoreButton>
          </ButtonWrapper>
        )}
      </CommunityListContainer>
    </GlobalSideBarContainer>
  );
};

export default GlobalSideBar;

const GlobalSideBarContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isModalOpen',
})<{ isModalOpen: boolean }>`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%; /* 전체 높이 */
  overflow-y: auto; /* 필요한 경우 스크롤 */
  background: #fff;
  margin-right: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-top: none;
  margin-top: 90px;
  position: fixed;
  z-index: ${({ isModalOpen }) => (isModalOpen ? -1 : 1000)};

  @media (max-width: 768px) {
    display: none;
  }
`;

const HomeList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'selectedButton' && prop !== 'isSideHovered',
})<HomeListProps>`
  padding: 6px 0;
  background-color: ${({ selectedButton, isSideHovered }) =>
    selectedButton === 'HOME' || isSideHovered === 'HOME'
      ? '#f0f0f0'
      : 'white'};
  border-radius: 5px;
`;

const MostCommentedList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'selectedButton' && prop !== 'isSideHovered',
})<HomeListProps>`
  padding: 6px 0;
  background-color: ${({ selectedButton, isSideHovered }) =>
    selectedButton === 'POPULAR' || isSideHovered === 'POPULAR'
      ? '#f0f0f0'
      : 'white'};
  border-radius: 5px;
  margin: 1px;
`;

const FrequentShareList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'selectedButton' && prop !== 'isSideHovered',
})<HomeListProps>`
  padding: 6px 0;
  background-color: ${({ selectedButton, isSideHovered }) =>
    selectedButton === 'FREQUENTSHARE' || isSideHovered === 'FREQUENTSHARE'
      ? '#f0f0f0'
      : 'white'};
  border-radius: 5px;
  margin: 1px;
`;

const TagMatchList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'selectedButton' && prop !== 'isSideHovered',
})<HomeListProps>`
  padding: 6px 0;
  background-color: ${({ selectedButton, isSideHovered }) =>
    selectedButton === 'TAGMATCH' || isSideHovered === 'TAGMATCH'
      ? '#f0f0f0'
      : 'white'};
  border-radius: 5px;
  margin: 1px;
`;

const CommunitySection = styled.div`
  font-weight: bold;
  padding-left: 10px;
  font-size: 14px;
`;

const CreateCommunityItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSideHovered',
})<HomeListProps>`
  display: flex;
  align-items: center;
  padding: 8px 0;
  background-color: ${({ isSideHovered }) =>
    isSideHovered === 'CREATE_COMMUNITY' ? '#f0f0f0' : 'white'};
  border-radius: 10px;
  margin: 5px;
  cursor: pointer;
  font-size: 14px;
`;

const CommunityListContainer = styled.div`
  flex: 1;
  padding: 5px 0 10px 10px;
  overflow-y: auto;
`;

const CommunityItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const CommunityIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CommunityName = styled.span`
  margin-left: 6px;
  cursor: pointer;
  font-size: 14px;
`;

const ShowMoreButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isLoading',
})<{isLoading:boolean}>`
  padding: 8px 16px;
  border-radius: 5px;
  background-color: #0079d3;
  color: white;
  border: none;
  cursor: pointer;
  visibility: ${({ isLoading }) => (isLoading ? 'hidden' : 'visible')};

  &:disabled {
    cursor: not-allowed;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`;