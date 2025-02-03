import React, { useEffect, useState } from 'react';
import {
  BoardListAPI,
  BoardPopularListAPI,
  BoardRecentListAPI,
  BoardShareListAPI,
  BoardTagsRelatedAPI,
} from '../../api/boardApi';
import Card from '../../../components/Card/Card';
import { CardType } from '../../../_common/collectionTypes';
import { MainListTypeState } from '../../../reducers/mainListTypeSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import styled from 'styled-components';
import { breakpoints } from '../../../_common/breakpoint';
import debounce from 'lodash.debounce';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from 'react-virtualized';
import GlobalStyle from '../../../_common/globalStyled';

const CommunityBanner = React.lazy(() => import('../CommunityBanner'))

const BoardList = () => {
  interface AllListParams {
    readonly id: IdType;
    readonly allDataLoaded: boolean;
  }
  type IdType = null | string;

  const [list, setList] = useState<CardType[]>([]);
  const TAKE: number = 5;
  const { buttonType }: MainListTypeState = useSelector((state: RootState) => state.sideBarButton,);
  const [id, setId] = useState<IdType>(null);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    setAllDataLoaded(false);
    setId(null);
    setList([]);
    debouncListApi({ id: null, allDataLoaded: false });
  }, [buttonType]);

  useEffect(() => {
    window.scrollTo(0, window.pageYOffset);
  }, [list]);

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

  const cache = new CellMeasurerCache({
    fixedWidth: true, 
    defaultHeight: 250, 
  });

  const rowRenderer = ({ index, key, style,parent }: any) => {
    const el = list[index];

    return (
      <CellMeasurer cache={cache} parent={parent} key={key} columnIndex={0} rowIndex={index}>
      <div key={key} style={style}>
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
      </div>
      </CellMeasurer>
    );
  };

  const handleScroll = ({ scrollTop, scrollHeight, clientHeight }: any) => {
    if (scrollTop + clientHeight >= scrollHeight - 100 && !allDataLoaded) {
      debouncListApi({ id, allDataLoaded });
    }
  }
  
  return (
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
          <GlobalStyle/>
        <AutoSizer>
            {({ width, height }) => (
              <List
              useWindowScroll
                width={width} 
                height={height}
                rowCount={list.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                onScroll={handleScroll}
              />
            )}
        </AutoSizer>
        </CardsContainer>
      </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-left: 2%;
 
  @media (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
    max-width: 100%;
  }
`;

const CardsContainer = styled.div`
  width: 100%;
  height: 85vh;
  box-sizing: border-box;
  display: flex;

  @media (max-width: ${breakpoints.mobile}) {
    height: 120vh;
  }

  @media(min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}){
    height: 110vh;
  }
`;

export default BoardList;