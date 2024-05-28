import React, { useEffect, useState } from "react";
import { AllListAPI, ListAPI, PopularListAPI } from "../api/BoardApi";
import Card from "../../components/Card";
import { CardType } from "../../_common/CollectionTypes";
import { MainListTypeState } from "../../reducers/mainListTypeSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
  console.log("buttonType : ", buttonType);

  useEffect(() => {
    if (buttonType === "HOME") {
      console.log("HOME : ", buttonType);
      ListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          console.log("list response : ", response);

          // setList([...response, ...mockingList]);
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
          console.log("list response : ", response);

          // setList([...response, ...mockingList]);
          setList([...response]);
        })
        .catch((err) => console.error(err));

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else if (buttonType === "ALL") {
      console.log("ALL : ", buttonType);
      AllListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          console.log("list response : ", response);

          // setList([...response, ...mockingList]);
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

          // setList([...response, ...mockingList]);
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

    // 페이지 하단에 도달햇는지 확인
    if (scrollTop + clientHeight >= scrollHeight - 15) {
      // 데이타 불러오는 함수 호출
      fetchData();
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
      console.log("fetchData HOME : ", buttonType);
      ListAPI({ take: TAKE, lastId: ID, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          const totalList: CardType[] = [...list, ...response];

          setList(totalList);
        })
        .catch((err) => console.error("fetchData ListAPI error : ", err));
    } else if (buttonType === "POPULAR") {
      console.log("fetchData POPULAR : ", buttonType);
      PopularListAPI({ take: TAKE, lastId: ID, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          console.log("list response : ", response);

          // setList([...response, ...mockingList]);
          setList([...response]);
        })
        .catch((err) => console.error("fetchData PopularListAPI : ", err));
    } else if (buttonType === "ALL") {
      console.log("fetchData ALL : ", buttonType);
      AllListAPI({ take: TAKE, lastId: ID, category: null })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          console.log("list response : ", response);

          // setList([...response, ...mockingList]);
          setList([...response]);
        })
        .catch((err) => console.error(err));
    } else {
      console.log("fetchData List : ", buttonType);
      AllListAPI({ take: TAKE, lastId: ID, category: buttonType })
        .then((res) => {
          const response: CardType[] = res.data.response.current_list;
          console.log("list response : ", response);

          // setList([...response, ...mockingList]);
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
                <>
                  <Card
                    id={el.id}
                    category={el.category}
                    title={el.title}
                    nickname={el.nickname}
                    createdAt={el.created_at}
                    content={el.content}
                    type={el.type}
                  />
                </>
              );
            })
          ) : (
            <div>텅!!</div>
          )}
        </CardsContainer>
      </MainContainer>
    </>
  );
};

export default BoardList;
