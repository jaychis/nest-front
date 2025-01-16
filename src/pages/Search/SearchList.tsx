import { useEffect, useState } from 'react';
import {
  GetSearchBoardsAPI,
  GetSearchCommentsAPI,
  GetSearchCommunitiesAPI,
  GetSearchMediaAPI,
  GetSearchPeopleAPI,
  GetSearchTagsAPI,
} from '../api/searchApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../components/Card';
import {
  CardType,
  CommunityType,
  UserType,
  TagType,
} from '../../_common/collectionTypes';
import BoardReply, {ReplyType} from '../Board/BoardRead/BoardReply';
import styled from 'styled-components';
import UserSearchCard from '../../components/UserSearchCard';
import { sideButtonSliceActions } from '../../reducers/mainListTypeSlice';
import { AppDispatch } from '../../store/store';
import { useDispatch } from 'react-redux';
import { MainListTypes } from '../../_common/collectionTypes';
import { breakpoints } from '../../_common/breakpoint';
import CommunitySearchCard from '../../components/CommunitySearchCard';

type SearchListTypes =
  | 'BOARDS'
  | 'COMMUNITIES'
  | 'COMMENTS'
  | 'IMAGE&VIDEO'
  | 'PEOPLE'
  | 'TAGS';
export type sortTypes = 'RECENT' | 'COMMENTS';

const SearchList = () => {
  const [searchCardList, setSearchCardList] = useState<CardType[]>([]);
  const [searchCommunityList, setSearchCommunityList] = useState<
    CommunityType[]
  >([]);
  const [searchReplyList, setSearchReplyList] = useState<ReplyType[]>([]);
  const [searUserList, setSearchUserList] = useState<UserType[]>([]);
  const [searchTagList, setSearchTagList] = useState<TagType[]>([]);
  const [params, setParams] = useSearchParams();
  const [searchType, setSearchType] = useState<SearchListTypes>('BOARDS');
  const QUERY: string = params.get('query') as string;
  const [sortType, setSortType] = useState<sortTypes>('RECENT');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (searchType === 'BOARDS') {
      GetSearchBoardsAPI({ query: QUERY, sortType: sortType })
        .then((res): void => {
          if (!res) return;
          const response = res.data.response;

          setSearchCardList(response);
        })
        .catch((err) =>
          console.error('SearchList GetSearchBoardsAPI error : ', err),
        );
    }

    if (searchType === 'COMMUNITIES') {
      GetSearchCommunitiesAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;
          const response = res.data.response;

          setSearchCommunityList(response);
        })
        .catch((err) =>
          console.error('SearchList GetSearchCommunitiesAPI error : ', err),
        );
    }

    if (searchType === 'COMMENTS') {
      GetSearchCommentsAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;

          const response = res.data.response;

          setSearchReplyList(response);
        })
        .catch((err) =>
          console.error('SearchList GetSearchCommentsAPI error : ', err),
        );
    }

    if (searchType === 'IMAGE&VIDEO') {
      GetSearchMediaAPI({ query: QUERY, sortType: sortType })
        .then((res): void => {
          if (!res) return;

          const response = res.data.response;

          setSearchCardList(response);
        })
        .catch((err) =>
          console.error('SearchList GetSearchMediaAPI error : ', err),
        );
    }

    if (searchType === 'PEOPLE') {
      GetSearchPeopleAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;

          const response = res.data.response;

          setSearchUserList(response);
        })
        .catch((err) =>
          console.error('SearchList GetSearchPeopleAPI error : ', err),
        );
    }

    if (searchType === 'TAGS') {
      GetSearchTagsAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;
          const response = res.data.response;

          setSearchTagList(response);
        })
        .catch((err) =>
          console.error('SearchList GetSearchTagsAPI error : ', err),
        );
    }
  }, [searchType, QUERY, sortType]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (viewport && viewport.width < 767) setSearchType('COMMUNITIES');
  }, []);

  const handleChangeSortType = (sortType: sortTypes) => {
    setSortType(sortType);
  };

  const navigateToCommunity = (communityName: MainListTypes) => {
    dispatch(
      sideButtonSliceActions.setButtonType({ buttonType: communityName }),
    );
    navigate('/');
  };

  const NavBarStateChange = async ({
    type,
  }: {
    readonly type: string;
  }): Promise<void> => {
    if (type === 'BOARDS') setSearchType('BOARDS');
    if (type === 'COMMUNITIES') setSearchType('COMMUNITIES');
    if (type === 'COMMENTS') setSearchType('COMMENTS');
    if (type === 'IMAGE&VIDEO') setSearchType('IMAGE&VIDEO');
    if (type === 'PEOPLE') setSearchType('PEOPLE');
    if (type === 'TAGS') setSearchType('TAGS');
  };

  const NavBar = () => {
    return (
      <NavContainer>
        <NavItem
          isActive={searchType === 'BOARDS'}
          onClick={() => NavBarStateChange({ type: 'BOARDS' })}
        >
          게시판
        </NavItem>
        <NavItem
          isActive={searchType === 'COMMUNITIES'}
          onClick={() => NavBarStateChange({ type: 'COMMUNITIES' })}
        >
          커뮤니티
        </NavItem>
        <NavItem
          isActive={searchType === 'COMMENTS'}
          onClick={() => NavBarStateChange({ type: 'COMMENTS' })}
        >
          댓글
        </NavItem>
        <NavItem
          isActive={searchType === 'IMAGE&VIDEO'}
          onClick={() => NavBarStateChange({ type: 'IMAGE&VIDEO' })}
        >
          사진 & 영상
        </NavItem>
        <NavItem
          isActive={searchType === 'PEOPLE'}
          onClick={() => NavBarStateChange({ type: 'PEOPLE' })}
        >
          사람
        </NavItem>
        <NavItem
          isActive={searchType === 'TAGS'}
          onClick={() => NavBarStateChange({ type: 'TAGS' })}
        >
          태그
        </NavItem>
      </NavContainer>
    );
  };

  return (
    <>
      <MainContainer>
        <NavBar />
        {(searchType === 'BOARDS' || searchType === 'IMAGE&VIDEO') && (
          <SortButtonContainer>
            <SortButton
              isActive={sortType === 'RECENT'}
              onClick={() => handleChangeSortType('RECENT')}
            >
              최신순
            </SortButton>
            <SortButton
              isActive={sortType === 'COMMENTS'}
              onClick={() => handleChangeSortType('COMMENTS')}
            >
              댓글순
            </SortButton>
          </SortButtonContainer>
        )}

        {(searchType === 'BOARDS' || searchType === 'IMAGE&VIDEO') &&
          searchCardList.map((ca: CardType) => {
            return (
              <>
                <Card
                  id={ca.id}
                  category={ca.category}
                  content={ca.content}
                  nickname={ca.nickname}
                  title={ca.title}
                  createdAt={ca.created_at}
                  type={ca.type}
                  shareCount={ca.share_count}
                  userId={ca.user_id}
                />
              </>
            );
          })}

        {searchType === 'COMMENTS' &&
          searchReplyList.map((re: ReplyType) => {
            return (
              <>
                <BoardReply
                  id={re.id}
                  comment_id={re.comment_id}
                  user_id={re.user_id}
                  content={re.content}
                  nickname={re.nickname}
                  created_at={re.created_at}
                  updated_at={re.updated_at}
                  deleted_at={re.deleted_at}
                />
              </>
            );
          })}

        {searchType === 'PEOPLE' &&
          searUserList.map((user: UserType) => {
            return (
              <>
                <UserSearchCard
                  nickname={user.nickname}
                  email={user.email}
                  profileImage={user?.users_profile}
                />
              </>
            );
          })}

        {searchType === 'COMMUNITIES' &&
          searchCommunityList.map((community: CommunityType, index) => {
            return (
              <div
                onClick={() => {
                  navigateToCommunity(community.name as MainListTypes);
                }}
              >
                <CommunitySearchCard
                  nickname={community.name}
                  profileImage={community.icon}
                  email={community.description}
                />
              </div>
            );
          })}

        {searchType === 'TAGS' &&
          searchTagList?.map((tags: TagType) => {
            return <div>{tags.name}</div>;
          })}
      </MainContainer>
    </>
  );
};

const NavContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
`;

const NavItem = styled.div<{ readonly isActive: boolean }>`
  margin: 1vh 0 0 1vw;
  padding: 20px;
  cursor: pointer;
  font-size: 16px;
  color: #000;
  border-radius: 40px;
  background-color: ${({ isActive }) => (isActive ? '#f0f0f0' : 'white')};
`;

const MainContainer = styled.div`
  margin: 0 0 0 200px;
  max-width: calc(100% - 200px);
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 1;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 0;
    max-width: 100%;
  }
`;

const SortButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 200px;
  padding: 10px;
  gap: 20px;
`;

const SortButton = styled.div<{ readonly isActive: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  color: #000;
  border-radius: 40px;
  background-color: ${({ isActive }) => (isActive ? '#f0f0f0' : 'white')};
`;

export default SearchList;
