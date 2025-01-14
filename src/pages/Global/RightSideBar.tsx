import React, { useEffect, useState } from 'react';
import { AddSearchAPI, GetTopTenSearchesAPI } from '../api/searchApi';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useSelector } from 'react-redux';
import { GetRecentViewedBoardsAPI } from '../api/viewedBoardsApi';
import { RootState } from '../../store/store';
import styled from 'styled-components';

type SelectTapTypes = 'topSearches' | 'recentBoards';
type RecentViewedPost = {
  readonly id: string;
  readonly title: string;
};

const RightSideBar = () => {
  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults,
  );
  const [isTopTenList, setIsTopTenList] = useState([]);
  const [recentViewedList, setRecentViewedList] = useState<RecentViewedPost[]>(
    [],
  );
  const [selectedTab, setSelectedTab] = useState<SelectTapTypes>('topSearches');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredRecentPostIndex, setHoveredRecentPostIndex] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const debouncedFetchTopTenList = debounce(async () => {
    try {
      const res = await GetTopTenSearchesAPI();
      if (!res) return;
      const response = res.data.response;
      setIsTopTenList(response);
    } catch (e: any) {
      if (e.response && e.response.status === 429) {
        setError('Too many requests. Please try again later.');
      } else if (e.response && e.response.status === 404) {
        setError('Endpoint not found. Please check the URL.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error(e);
    }
  }, 1000);

  useEffect(() => {
    debouncedFetchTopTenList();
  }, [searchResults]);

  useEffect(() => {
    if (selectedTab === 'topSearches') {
      debouncedFetchTopTenList();
    }

    if (selectedTab === 'recentBoards' && isLoggedIn) {
      const recentBoardList = async (): Promise<void> => {
        const res = await GetRecentViewedBoardsAPI({
          userId: localStorage.getItem('id') as string,
        });

        if (!res) return;
        const response = res.data.response;

        const formattedRecentViewedList = response.map((item: any) => ({
          id: item.board_id,
          title: item.board.title,
        }));

        setRecentViewedList(formattedRecentViewedList);
      };
      recentBoardList();
    }
  }, [selectedTab, isLoggedIn]);

  const handleSearchClick = async (query: string) => {
    await AddSearchAPI({ query });
    navigate(`/search/list?query=${query}`);
  };

  const handleTabClick = (tab: SelectTapTypes) => {
    if (tab === 'recentBoards' && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    setSelectedTab(tab);
  };

  return (
    <RightSideBarContainer>
      <SidebarContent>
        <Tabs>
          <Tab
            active={selectedTab === 'topSearches'}
            onClick={() => setSelectedTab('topSearches')}
          >
            실시간 검색어
          </Tab>

          <Tab
            active={selectedTab === 'recentBoards'}
            onClick={() => handleTabClick('recentBoards')}
          >
            최근 본 게시물
          </Tab>
        </Tabs>

        {error && <ErrorText>{error}</ErrorText>}
        {selectedTab === 'topSearches' ? (
          <ScrollableList>
            <Header>실시간 검색어 TOP 10</Header>
            <List>
              {isTopTenList.length > 0 ? (
                isTopTenList.map(
                  (
                    search: {
                      readonly query: string;
                      readonly count: number;
                    },
                    index: number,
                  ) => (
                    <ListItem
                      key={index}
                      hovered={hoveredIndex === index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleSearchClick(search.query)} // Add onClick event
                    >
                      <div>
                        <Rank>{index + 1}</Rank>
                        <Query>{search.query}</Query>
                      </div>
                      {/*<Details>*/}
                      {/*  <Count>{search.count}</Count>*/}
                      {/*</Details>*/}
                    </ListItem>
                  ),
                )
              ) : (
                <p>데이터를 불러오는 중...</p>
              )}
            </List>
          </ScrollableList>
        ) : (
          isLoggedIn && (
            <ScrollableList>
              <Header>최근 본 게시물</Header>
              <List>
                {recentViewedList.length > 0 ? (
                  recentViewedList.map((post, index) => (
                    <ListItem
                      key={post.id}
                      hovered={hoveredRecentPostIndex === index}
                      onMouseEnter={() => setHoveredRecentPostIndex(index)}
                      onMouseLeave={() => setHoveredRecentPostIndex(null)}
                    >
                      <Link
                        href={`/boards/read?id=${post.id}&title=${post.title}`}
                      >
                        {post.title}
                      </Link>
                    </ListItem>
                  ))
                ) : (
                  <p>최근 본 게시물이 없습니다.</p>
                )}
              </List>
            </ScrollableList>
          )
        )}
      </SidebarContent>
    </RightSideBarContainer>
  );
};

const RightSideBarContainer = styled.div`
  width: 250px;
  margin-left: auto;
  margin-right: 20px;

  @media (max-width: 610px) {
    display: none;
  }
`;

const SidebarContent = styled.div`
  width: 250px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  position: fixed;
  margin-top: 90px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Tab = styled.div.withConfig({ 
  shouldForwardProp: (prop) => prop !== 'active',
})<{readonly active: boolean}>`
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.active ? '#0079D3' : '#ddd')};
  background: ${(props) => (props.active ? '#0079D3' : '#f0f0f0')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  font-weight: bold;
  font-size: 14px;
`;

const ErrorText = styled.div`
  color: red;
`;

const ScrollableList = styled.div`
  max-height: 75%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0px; /* 웹킷 기반 브라우저(Chrome, Safari 등)에서 스크롤바의 너비를 0으로 설정하여 숨김 */
  }

  -ms-overflow-style: none; /* IE와 Edge에서 스크롤바를 숨김 */
  scrollbar-width: none; /* Firefox에서 스크롤바를 숨김 */
`;

const Header = styled.h3`
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const List = styled.ol`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li.withConfig({ 
  shouldForwardProp: (prop) => prop !== 'hovered',
})<{readonly hovered: boolean}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  background: ${(props) => (props.hovered ? '#f0f0f0' : 'white')};
  color: black;
  border-radius: ${(props) => (props.hovered ? '15px' : '0')};
`;

const Rank = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 15px;
`;

const Query = styled.span`
  font-size: 16px;
  color: #333;
`;

const Link = styled.a`
  font-size: 16px;
  color: #333;
  text-decoration: none;
`;

export default RightSideBar;
