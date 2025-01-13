import React, { useEffect, useState } from 'react';
import {
  BoardListAPI,
  BoardPopularListAPI,
  BoardRecentListAPI,
  BoardShareListAPI,
  BoardTagsRelatedAPI,
} from '../api/boardApi';
import Card from '../../components/Card';
import { CardType } from '../../_common/collectionTypes';
import { MainListTypeState } from '../../reducers/mainListTypeSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import EmptyState from '../../components/EmptyState';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { breakpoints } from '../../_common/breakpoint';
import debounce from 'lodash.debounce';

const CommunityBanner = React.lazy(() => import('./CommunityBanner'))

const BoardList = () => {
  interface AllListParams {
    readonly id: IdType;
    readonly allDataLoaded: boolean;
  }
  type IdType = null | string;

  const [list, setList] = useState<CardType[]>([]);
  const TAKE: number = 5;
  const { buttonType }: MainListTypeState = useSelector(
    (state: RootState) => state.sideBarButton,
  );
  const [ref, inView] = useInView();
  const [lastInView, setLastInView] = useState<boolean>(false);
  const [id, setId] = useState<IdType>(null);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    if (list.length > 0 && inView && !lastInView) {
      debouncListApi({ id, allDataLoaded });
    }
    setLastInView(inView);
  }, [inView]);

  useEffect(() => {
    setAllDataLoaded(false);
    setId(null);
    setList([]);
    setLastInView(false);
    debouncListApi({ id: null, allDataLoaded: false });
  }, [buttonType]);

  const ListApi = async ({ id, allDataLoaded }: AllListParams) => {
    if (allDataLoaded) return;

    try {
      let response;
      switch (buttonType) {
        case 'HOME':
          response = await BoardListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;

        case 'POPULAR':
          response = await BoardPopularListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;

        case 'TAGMATCH':
          response = await BoardTagsRelatedAPI({
            take: TAKE,
            lastId: id,
            category: null,
            userId: localStorage.getItem('id') as string,
          });
          break;

        case 'FREQUENTSHARE':
          response = await BoardShareListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;

        case 'ALL':
          response = await BoardRecentListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;

        default:
          response = await BoardListAPI({
            take: TAKE,
            lastId: id,
            category: buttonType,
          });
          break;
      }

      const res = response?.data?.response;
      if (!res) return;
      const newCards = res.current_list;
      setList((prevList) => [...prevList, ...newCards]);

      if (newCards.length > 0) {
        setId(newCards[newCards.length - 1].id);
      } else {
        setAllDataLoaded(true);
      }
    } catch (err) {
      console.error('API error: ', err);
    }
  };

  const debouncListApi = debounce(ListApi,300)

  return (
    <>
      <MainContainer>
        {buttonType !== 'HOME' &&
          buttonType !== 'POPULAR' &&
          buttonType !== 'TAGMATCH' &&
          buttonType !== 'FREQUENTSHARE' &&
          buttonType !== 'ALL' && (
            <>
              <CommunityBanner />
            </>
          )}
        <CardsContainer>
          {list.length ? (
            list.map((el: CardType, index) => {
              return (
                <React.Fragment key={`${el.id}-${index}`}>
                  <Card
                    id={el.id}
                    category={el.category}
                    title={el.title}
                    nickname={el.nickname}
                    createdAt={el.created_at}
                    content={el.content}
                    type={el.type}
                    shareCount={el.share_count}
                    userId={el.user_id}
                    profileImage={el.user_profile?.profile_image as string}
                  />
                </React.Fragment>
              );
            })
          ) : (
            <EmptyState />
          )}
        </CardsContainer>
      </MainContainer>
      <InvisibleRefContainer ref={ref}>d</InvisibleRefContainer>
    </>
  );
};

const MainContainer = styled.div`
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

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
`;

const InvisibleRefContainer = styled.div`
  opacity: 0;
`;

export default BoardList;
