import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MainListTypes,
  RecentCommunityListType,
} from '../../../_common/collectionTypes';
import { AppDispatch } from '../../../store/store';
import { sideButtonSliceActions } from '../../../reducers/mainListTypeSlice';
import {
  setCommunity,
  SelectCommunityParams,
} from '../../../reducers/communitySlice';
import { RootState } from '../../../store/store';
import { CommunityListAPI, getRecentCommunitiesAPI } from '../../api/communityApi';
import Tooltip from '../../../components/Tooltip';
import styled from 'styled-components';
import { breakpoints } from '../../../_common/breakpoint';
import { JAYCHIS_LOGO } from '../../../_common/jaychisLogo';

const GlobalSideBar = () => {
  const sideBarTabList = [
    {type: 'HOME',title: '홈', image: '🏠', content: '사용자들이 좋아요를 많이 누른 랭킹킹순입니다.'},
    {type: 'POPULAR',title: '실시간', image: '🔥', content: '사용자들이 댓글을 많이 단 랭킹입니다.'},
    {type: 'FREQUENTSHARE',title: '퍼주기', image: '🌍', content: '사용자들이 많이 공유한 랭킹입니다.'},
    {type: 'TAGMATCH',title: '내가 좋아할 글', image: '💖', content: '사용자가 좋아할 만한 태그를 가진 랭킹입니다.'},
    {type: 'ALL',title: '모든 리스트', image: '📚', content: '최신순으로 정렬된 랭킹입니다.'},
  ]
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { hamburgerState, buttonType } = useSelector(
    (state: RootState) => state.sideBarButton,
  );
  const [isSideHovered, setIsSideHovered] = useState<string | null>('');
  const [selectedButton, setSelectedButton] =
    useState<MainListTypes>(buttonType);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');

  const [communityList, setCommunityList] = useState<SelectCommunityParams[]>([],);
  const [communityNamesSet, setCommunityNamesSet] = useState<Set<string>>(
    new Set(),
  );
  const [displayCount, setDisplayCount] = useState(5);

  const [recentCommunityList, setRecentCommunityList] = useState<
    RecentCommunityListType[]
  >([]);

  const fetchCommunities = async (page: number) => {
    setLoading(true);

    try {
      const res = await CommunityListAPI({ take: 10, page });
      if (!res) return;
      const response = res.data.response.current_list;
      const uniqueCommunities = response.filter(
        (community: SelectCommunityParams) => {
          if (communityNamesSet.has(community.name as string)) {
            return false;
          } else {
            communityNamesSet.add(community.name as string);
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
    const fetchGetRectCommunities = async () => {
      const response = await getRecentCommunitiesAPI();
      if (!response) return;

      const res = response.data.response;
      setRecentCommunityList(res);
    };

    if (localStorage.getItem('id') && localStorage.getItem('nickname')) {
      fetchGetRectCommunities();
    }
  }, []);

  useEffect(() => {
    const initialSet: Set<string> = new Set(
      communityList.map((community) => community.name as string),
    );
    setCommunityNamesSet(initialSet);
  }, [communityList]);

  interface CommunityClickType {
    readonly button: MainListTypes;
  }
  const sendDispatchSideBtn = async ({ button }: CommunityClickType) => {
    dispatch(sideButtonSliceActions.setButtonType({ buttonType: button }));
    dispatch(
      sideButtonSliceActions.setHamburgerState({ hamburgerState: false }),
    );
  };

  const handleClick = async (button: MainListTypes) => {
    if (button === 'TAGMATCH' && !(localStorage.getItem('id') as string)) {
      return alert('회원가입 유저에게만 제공되는 기능입니다.');
    }

    setSelectedButton(button);
    await sendDispatchSideBtn({ button });
    navigate('/');
  };

  const handleCommunityClick = async (
    { button }: CommunityClickType,
    index: number,
  ) => {
    dispatch(setCommunity(communityList[index]));
    sessionStorage.setItem('community',JSON.stringify(communityList[index]))
    sessionStorage.setItem('community_name',communityList[index].name as string)
    sessionStorage.setItem('community_icon',communityList[index].icon as string)
    sessionStorage.setItem('community_banner',communityList[index].banner as string)
    await sendDispatchSideBtn({ button });
    await navigate(`/j/${button}`);
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
    <>
      <GlobalSideBarContainer>
        
          {sideBarTabList.map((item, index) => {
            return(
              <SidebarItem
              key={item.type}
              itemType={item.type}
              selectedButton={selectedButton}
              isSideHovered={isSideHovered}
              onMouseEnter={() => setIsSideHovered(item.type)}
              onMouseLeave={() => setIsSideHovered(null)}
              onClick={() => handleClick(item.type as MainListTypes)}>
                <Tooltip
                title={item.title}
                image={item.image}
                content={item.content}
                />
              </SidebarItem>
            )})}

        <RecentSection>RECENT</RecentSection>
        <RecentContainer>
          {recentCommunityList.length > 0
            ? recentCommunityList
                .slice(0, displayCount)
                .map((community: RecentCommunityListType, index) => (
                  <CommunityItem key={community.community.id || index}>
                    <CommunityIcon
                      width="20"
                      height="20"
                      src={
                        community.community.icon
                          ? community.community.icon
                          : JAYCHIS_LOGO
                      }
                      alt={'recent visit community icon'}
                      onClick={() =>
                        handleCommunityClick(
                          {
                            button: community.community.name,
                          } as CommunityClickType,
                          index,
                        )
                      }
                    />
                    <CommunityName
                      onClick={() =>
                        handleCommunityClick(
                          {
                            button: community.community.name,
                          } as CommunityClickType,
                          index,
                        )
                      }
                    >
                      j/{community.community.name}
                    </CommunityName>
                  </CommunityItem>
                ))
            : []}
        </RecentContainer>

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
                    <picture>
                    <source srcSet = {community.icon as string | undefined} type="image/webp"></source>
                    <CommunityIcon
                      width="20"
                      height="20"
                      src={community.icon ? community.icon : JAYCHIS_LOGO}
                      alt={'community icon'}
                      onClick={() =>
                        handleCommunityClick(
                          { button: community.name } as CommunityClickType,
                          index,
                        )
                      }
                    />
                    </picture>
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
    </>
  );
};

export default GlobalSideBar;

const GlobalSideBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  overflow: visible;
  background: #fff;
  margin-right: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-top: none;
  margin-top: 90px;
  position: fixed;
  z-index: 2001;

  @media (max-width: ${breakpoints.mobile}) {
    z-index: 1000;
    position: fixed;
    transition:
      height 0.35s ease,
      margin 0.35s ease,
      width 0.35s ease;
  }
`;

const SidebarItem = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !['selectedButton', 'isSideHovered', 'itemType'].includes(prop),
})<{
  readonly selectedButton: string;
  readonly isSideHovered: string | null;
  readonly itemType: string;
}>`
  padding: 6px 0;
  background-color: ${({ selectedButton, isSideHovered, itemType }) =>
    selectedButton === itemType || isSideHovered === itemType
      ? '#f0f0f0'
      : 'white'};
  border-radius: 5px;
  cursor: pointer;
`;

const CommunitySection = styled.div`
  font-weight: bold;
  padding-left: 10px;
  font-size: 14px;
`;

const CreateCommunityItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isSideHovered'].includes(prop),
})<{
  readonly isSideHovered: string | null;
}>`
  display: flex;
  lign-items: center;
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
  height: calc(100vh - 150px);
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
})<{ readonly isLoading: boolean }>`
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

const RecentSection = styled.div`
  font-weight: bold;
  padding-left: 10px;
  font-size: 1rem;
`;

const RecentContainer = styled.div`
  padding: 5px 0 10px 10px;
`;
