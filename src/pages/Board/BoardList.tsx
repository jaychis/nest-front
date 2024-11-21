import React, { useEffect, useState } from 'react';
import {
  BoardListAPI,
  BoardPopularListAPI,
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
import CommunityBanner from './CommunityBanner';

interface ContainerProps {
  children?: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
        marginLeft: '1%',
        marginTop: '1%'
      }}
    >
      {children}
    </div>
  );
};

// const CardsContainer: React.FC<ContainerProps> = ({ children }) => {
const CardsContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px', // 적절한 최대 너비 설정
        boxSizing: 'border-box',
        padding: '0 20px', // 좌우 패딩 추가
      }}
    >
      {children}
    </div>
  );
};

const BoardList = () => {
  interface AllListParams {
    readonly id: IdType;
    readonly allDataLoaded: boolean;
  }
  type IdType = null | string;

  const [list, setList] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Move useState inside the component
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
      ListApi({ id, allDataLoaded });
    }
    setLastInView(inView);
  }, [inView]);

  useEffect(() => {
    setAllDataLoaded(false);
    setId(null);
    setList([]);
    setLastInView(false);
    ListApi({ id: null, allDataLoaded:false });
    
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

  return (
    <>
      <MainContainer>
        {buttonType !== 'HOME' &&
          buttonType !== 'POPULAR' &&
          buttonType !== 'TAGMATCH' &&
          buttonType !== 'FREQUENTSHARE' && (
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
                    // 고유한 키 추가
                    id={el.id}
                    category={el.category}
                    title={el.title}
                    nickname={el.nickname}
                    createdAt={el.created_at}
                    content={el.content}
                    type={el.type}
                    shareCount={el.share_count}
                  />
                </React.Fragment>
              );
            })
          ) : (
            <EmptyState /> // Use the EmptyState component
          )}
        </CardsContainer>
      </MainContainer>
      <div style={{ opacity: '0' }} ref={ref}>
        d
      </div>
    </>
  );
};

export default BoardList;
