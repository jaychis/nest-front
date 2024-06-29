import React, { useEffect, useState } from "react";
import { AllListAPI, ListAPI, PopularListAPI } from "../api/BoardApi";
import Card from "../../components/Card";
import { CardType } from "../../_common/CollectionTypes";
import { MainListTypeState } from "../../reducers/mainListTypeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import EmptyState from "../../components/EmptyState";

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
  const [list, setList] = useState<CardType[]>([]);
  const TAKE: number = 5;
  const { buttonType }: MainListTypeState = useSelector(
    (state: RootState) => state.sideBarButton,
  );

  useEffect(() => {
    if (buttonType === "HOME") {
      ListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;

          setList([...response]);
        })
        .catch((err) => console.error(err));

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else if (buttonType === "POPULAR") {
      console.log("POPULAR : ", buttonType);
      PopularListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;

          setList([...response]);
        })
        .catch((err) => console.error(err));

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else if (buttonType === "ALL") {
      AllListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          console.log("list response : ", response);

          setList([...response]);
        })
        .catch((err) => console.error(err));

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      AllListAPI({ take: TAKE, lastId: null, category: buttonType })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          console.log("list response : ", response);

          setList([...response]);
        })
        .catch((err) => console.error(err));

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [buttonType]);
  
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
    if (scrollTop + clientHeight >= scrollHeight - 15) {
      if (!loading) { // 로딩 상태를 확인하여 중복 요청 방지
        fetchData();
      }
    }
  };

  window.addEventListener("scroll", handleScroll);

  const [loading, setLoading] = useState<boolean>(false);
  const fetchData = () => {
    if (loading || list.length === 0) return;
    setLoading(true);

    const ID = list[list.length - 1].id;

    //
    if (buttonType === "HOME") {
      ListAPI({ take: TAKE, lastId: ID, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          const totalList: CardType[] = [...list, ...response];

          setList(totalList);
        })
        .catch((err) => console.error("fetchData ListAPI error : ", err));
    } else if (buttonType === "POPULAR") {
      PopularListAPI({ take: TAKE, lastId: ID, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;

          setList([...response]);
        })
        .catch((err) => console.error("fetchData PopularListAPI : ", err));
    } else if (buttonType === "ALL") {
      AllListAPI({ take: TAKE, lastId: ID, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;

          setList([...response]);
        })
        .catch((err) => console.error(err));
    } else {
      AllListAPI({ take: TAKE, lastId: ID, category: buttonType })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;

          setList([...response]);
        })
        .catch((err) => console.error(err));
    }

    //
    setLoading(false);
  };

  return (
    <>
      <MainContainer>
        <CardsContainer>
          {list.length > 0 ? (
            list.map((el: CardType) => {
              // console.log("el : ", el);

              return (
                <React.Fragment key={el.id}>
                  <Card
                    key={el.id} // 고유한 키 추가
                    id={el.id}
                    category={el.category}
                    title={el.title}
                    nickname={el.nickname}
                    createdAt={el.created_at}
                    content={el.content}
                    type={el.type}
                  />
                </React.Fragment>
              );
            })
          ) : (
            <EmptyState /> // Use the EmptyState component
          )}
        </CardsContainer>
      </MainContainer>
    </>
  );
};

export default BoardList;
