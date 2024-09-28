import React, { useEffect, useState } from "react";
import { AllListAPI, ListAPI, PopularListAPI } from "../api/BoardApi";
import Card from "../../components/Card";
import { CardType } from "../../_common/CollectionTypes";
import { MainListTypeState } from "../../reducers/mainListTypeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import EmptyState from "../../components/EmptyState";
import { useInView } from "react-intersection-observer";
import { UserModalState, setModalState} from "../../reducers/modalStateSlice";

interface ContainerProps {
  children?: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

// const CardsContainer: React.FC<ContainerProps> = ({ children }) => {
const CardsContainer = ({ children }: ContainerProps) => {
  const modalState : UserModalState = useSelector((state: RootState) => state.modalState);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "800px", // 적절한 최대 너비 설정
        boxSizing: "border-box",
        padding: "0 20px", // 좌우 패딩 추가
        
      }}
    >
      {children}
    </div>
  );
};

const BoardList = () => {
  type IdType = null | string;

  const [list, setList] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Move useState inside the component
  const TAKE: number = 5;
  const { buttonType }: MainListTypeState = useSelector(
    (state: RootState) => state.sideBarButton,
  );
  const [ref, inView] = useInView();
  const [Id, setId] = useState<IdType>(null);
  const [lastInView, setLastInView] = useState<boolean>(false);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  

  useEffect(() => {
    if (inView && !lastInView) {
      ListApi(Id);
    }
    setLastInView(inView);
  }, [inView]);

  useEffect(() => {
    ListApi(Id);
  }, []);

  const ListApi = async (id: IdType) => {
    if (allDataLoaded) return;
    try {
      let response;
      switch (buttonType) {
        case "HOME":
          response = await ListAPI({ take: TAKE, lastId: id, category: null });
          break;
        case "POPULAR":
          response = await PopularListAPI({
            take: TAKE,
            lastId: id,
            category: null,
          });
          break;
        case "ALL":
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
      console.error("API error: ", err);
    }
  };

  if (!list[0]) {
    return <div>로딩중..</div>;
  }

  return (
    <>
      <MainContainer>
        <CardsContainer>
          {list.length ? (
            list.map((el: CardType, index) => {
              return (
                <React.Fragment key={el.id}>

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
      <div style={{ opacity: "0" }} ref={ref}>
        d
      </div>
    </>
  );
};

export default BoardList;
