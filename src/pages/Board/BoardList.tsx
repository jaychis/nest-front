import React, { useEffect, useState } from 'react';
import { AllListAPI, ListAPI, PopularListAPI } from '../api/BoardApi';
import Card from '../../components/Card';
import { CardType } from '../../_common/CollectionTypes';
import { MainListTypeState } from '../../reducers/mainListTypeSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import EmptyState from '../../components/EmptyState';
import { useInView } from 'react-intersection-observer';
import { UserModalState } from '../../reducers/modalStateSlice';
import styled from 'styled-components';

interface ContainerProps {
  children?: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return <StyledMainContainer>{children}</StyledMainContainer>;
};

const CardsContainer = ({ children }: ContainerProps) => {
  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );
  return <StyledCardsContainer>{children}</StyledCardsContainer>;
};

const BoardList = () => {
  type IdType = null | string;

  const [list, setList] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const TAKE: number = 5;
  const { buttonType }: MainListTypeState = useSelector(
    (state: RootState) => state.sideBarButton,
  );
  const [ref, inView] = useInView();
  const [Id, setId] = useState<IdType>(null);
  const [lastInView, setLastInView] = useState<boolean>(false);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  const [retry, setRetry] = useState<number>(0);

  useEffect(() => {
    if (inView && !lastInView) {
      ListApi(Id);
    }
    setLastInView(inView);
  }, [inView]);

  useEffect(() => {
    setId(null);
    setList([]);
    setAllDataLoaded(false);
    if (Id === null) {
      ListApi(Id);
    } else {
      setRetry((prev) => prev + 1);
    }
  }, [buttonType, retry]);

  const ListApi = async (id: IdType) => {
    if (allDataLoaded) return;
    try {
      let response;
      switch (buttonType) {
        case 'HOME':
          response = await ListAPI({ take: TAKE, lastId: id, category: null });
          break;
        case 'POPULAR':
          response = await PopularListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;
        case 'TAGMATCH':
          response = await AllListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;
        case 'FREQUENTSHARE':
          response = await AllListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;
        default:
          response = await AllListAPI({
            take: TAKE,
            lastId: id,
            category: buttonType,
          });
          break;
      }
      const newCards = response.data.response.current_list;
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

  if (!list[0]) {
    return (
      <div>
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <MainContainer>
        <CardsContainer>
          {list.length ? (
            list.map((el: CardType) => {
              return (
                <React.Fragment key={el.id}>
                  <Card
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
            <EmptyState />
          )}
        </CardsContainer>
      </MainContainer>
      <StyledInvisibleDiv ref={ref}>d</StyledInvisibleDiv>
    </>
  );
};

export default BoardList;

/* 스타일드 컴포넌트 */
const StyledMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const StyledCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px; /* 적절한 최대 너비 설정 */
  box-sizing: border-box;
  padding: 0 20px; /* 좌우 패딩 추가 */
`;

const StyledInvisibleDiv = styled.div`
  opacity: 0;
`;
