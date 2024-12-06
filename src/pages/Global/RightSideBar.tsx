import React, { useEffect, useState } from 'react';
import { AddSearchAPI, GetTopTenSearchesAPI } from '../api/searchApi';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useSelector } from 'react-redux';
import { GetRecentViewedBoardsAPI } from '../api/viewedBoardsApi';
import { RootState } from '../../store/store';
import { UserModalState } from '../../reducers/modalStateSlice';
import styled from 'styled-components';

type SelectTapTypes = 'topSearches' | 'recentBoards';

type RecentViewedPost = {
  id: string;
  title: string;
};

const RightSideBar = () => {
  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );
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
  // Debounced fetch function

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
      <SidebarContent modalState={modalState.modalState}>
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
            <h3 style={styles.header}>실시간 검색어 TOP 10</h3>
            <ol style={styles.list}>
              {isTopTenList.length > 0 ? (
                isTopTenList.map(
                  (
                    search: {
                      readonly query: string;
                      readonly count: number;
                    },
                    index: number,
                  ) => (
                    <li
                      key={index}
                      style={
                        hoveredIndex === index
                          ? styles.hoveredListItem
                          : styles.listItem
                      }
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleSearchClick(search.query)} // Add onClick event
                    >
                      <div>
                        <span style={styles.rank}>{index + 1}</span>
                        <span style={styles.query}>{search.query}</span>
                      </div>
                      <div style={styles.details}>
                        <span style={styles.count}>{search.count}</span>
                      </div>
                    </li>
                  ),
                )
              ) : (
                <p>데이터를 불러오는 중...</p>
              )}
            </ol>
          </ScrollableList>
        ) : (
          isLoggedIn && (
            <ScrollableList>
              <h3 style={styles.header}>최근 본 게시물</h3>
              <ul style={styles.list}>
                {recentViewedList.length > 0 ? (
                  recentViewedList.map((post, index) => (
                    <li
                      key={post.id}
                      style={
                        hoveredRecentPostIndex === index
                          ? styles.hoveredListItem
                          : styles.listItem
                      }
                      onMouseEnter={() => setHoveredRecentPostIndex(index)}
                      onMouseLeave={() => setHoveredRecentPostIndex(null)}
                    >
                      <a
                        href={`/boards/read?id=${post.id}&title=${post.title}`}
                        style={styles.link}
                      >
                        {post.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <p>최근 본 게시물이 없습니다.</p>
                )}
              </ul>
            </ScrollableList>
          )
        )}
      </SidebarContent>
    </RightSideBarContainer>
  );
};

const styles = {
  activeTab: {
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '1px solid #0079D3',
    background: '#0079D3',
    color: '#fff',
    fontWeight: 'bold' as 'bold',
    fontSize: '14px', // Reduced font size
  },
  header: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none' as 'none',
    padding: '0',
    margin: '0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
    background: 'white',
    color: 'black',
  },
  hoveredListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
    background: '#f0f0f0',
    color: 'black',
    borderRadius: '15px',
  },
  rank: {
    fontSize: '18px',
    fontWeight: 'bold' as 'bold',
    color: '#333',
    marginRight: '15px', // Add margin to create space between rank and query
  },
  query: {
    fontSize: '16px',
    color: '#333',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    fontSize: '14px',
    color: '#666',
  },
  count: {
    marginRight: '10px',
    fontWeight: 'bold' as 'bold',
  },
  source: {
    fontStyle: 'italic',
  },
  link: {
    fontSize: '16px',
    color: '#333', // Match the text color with query
    textDecoration: 'none' as 'none',
  },
};

export default RightSideBar;

const RightSideBarContainer = styled.div`
  width: 250px;
  margin-left: auto;
  margin-right: 20px;

  @media (max-width: 767px) {
    display: none; // 모바일에서 숨김
  }
`;

const SidebarContent = styled.div<{ readonly modalState: boolean }>`
  width: 250px;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  position: fixed;
  z-index: ${(props) => (props.modalState ? -1 : 1000)};
  margin-top: 90px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Tab = styled.div<{ readonly active: boolean }>`
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
  max-height: 500px; /* Adjust as needed to control the scroll area size */
  overflow-y: auto; /* Enables vertical scrolling if content exceeds max-height */
`;
