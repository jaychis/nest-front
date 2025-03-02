import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MainListTypes,RecentCommunityListType,} from '../../../_common/collectionTypes';
import { AppDispatch } from '../../../store/store';
import { sideButtonSliceActions } from '../../../reducers/mainListTypeSlice';
import {SelectCommunityParams,} from '../../../reducers/communitySlice';
import { RootState } from '../../../store/store';
import { CommunityListAPI, getRecentCommunitiesAPI } from '../../api/communityApi';
import Tooltip from '../../../components/Tooltip';
import styled from 'styled-components';
import { breakpoints } from '../../../_common/breakpoint';
import CommunityList from './CommunityList';

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
  const { buttonType } = useSelector(
    (state: RootState) => state.sideBarButton,
  );
  const [isSideHovered, setIsSideHovered] = useState<string | null>('');
  const [selectedButton, setSelectedButton] =
    useState<MainListTypes>(buttonType);
  const [page, setPage] = useState(1);
  const isLoggedIn = !!localStorage.getItem('access_token');
  const [list, setList] = useState<SelectCommunityParams[]>([],);
  const [communityNamesSet, setCommunityNamesSet] = useState<Set<string>>(new Set(),);
  const [recentCommunityList, setRecentCommunityList] = useState<RecentCommunityListType[]>([]);

  const fetchCommunities = async (page: number) => {

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
      setList((prevList) => [...prevList, ...uniqueCommunities]);
      console.log(list)
    } catch (err) {
      console.log('CommunityListAPI error: ', err);
    }
  };

  useEffect(() => {
    fetchCommunities(page);
  }, [page]);

  useEffect(() => {
    const fetchGetRectCommunities = async () => {
      const response = await getRecentCommunitiesAPI();
      if (!response) return;
      /* list와 recentCommunityList의 데이터 형식이 달라 맞춰주기 위함 */
      const res = response.data.response;
      const temp = []
      for(let k of res){
        temp.push(k.community)
      }
      setRecentCommunityList(temp);
      console.log(response.data.response)
      console.log(recentCommunityList)
    };

    if (localStorage.getItem('id') && localStorage.getItem('nickname')) {
      fetchGetRectCommunities();
    }
  }, []);

  useEffect(() => {
    const initialSet: Set<string> = new Set(
      list.map((community) => community.name as string),
    );
    setCommunityNamesSet(initialSet);
  }, [list]);

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
        <CommunityList
        type={'recent'}
        list={recentCommunityList}
        />

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

        <CommunityList 
        type={'communityList'}
        list={list}
        /> 
        
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

const RecentSection = styled.div`
  font-weight: bold;
  padding-left: 10px;
  font-size: 1rem;
`;