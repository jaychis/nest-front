import React, { useEffect, useState } from "react";
import { AllListAPI, ListAPI, PopularListAPI } from "../api/BoardApi";
import Card from "../../components/Card";
import { ReactionTypes } from "../../_common/CollectionTypes";
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
        height: "100vh",
        width: "100vw",
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
        maxWidth: "1100px",

      }}
    >
      {children}
    </div>
  );
};

interface ListType {
  readonly id: string;
  readonly identifier_id: string;
  readonly category: string;
  readonly content: string;
  readonly title: string;
  readonly nickname: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at?: Date | null;

  readonly reactions: {
    id: string;
    type: ReactionTypes;
    user_id: string;
    board_id: string;
    created_at: Date;
    updated_at: Date;
    board: null | {
      id: string;
      identifier_id: string;
      title: string;
      content: string;
      category: string;
      nickname: string;
      board_score: number;
      created_at: Date;
      updated_at: Date;
      deleted_at: null | Date;
    };
  }[];
}

const BoardList = () => {
  const [list, setList] = useState<ListType[]>([]);
  const TAKE: number = 6;
  const { buttonType }: MainListTypeState = useSelector(
    (state: RootState) => state.sideBarButton,
  );
  console.log("buttonType : ", buttonType);

  useEffect(() => {
    if (buttonType === "HOME") {
      console.log("HOME : ", buttonType);
      ListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: ListType[] = res.data.response.current_list;
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

    if (buttonType === "POPULAR") {
      console.log("POPULAR : ", buttonType);
      PopularListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: ListType[] = res.data.response.current_list;
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

    if (buttonType === "ALL") {
      console.log("ALL : ", buttonType);
      AllListAPI({ take: TAKE, lastId: null, category: null })
        .then((res) => {
          const response: ListType[] = res.data.response.current_list;
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
  const handleScroll = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 페이지 하단에 도달햇는지 확인
    if (scrollTop + clientHeight >= scrollHeight - 15) {
      // 데이타 불러오는 함수 호출
      await fetchData();
    }
  };

  window.addEventListener("scroll", handleScroll);

  const [loading, setLoading] = useState<boolean>(false);
  const fetchData = async () => {
    if (loading || list.length === 0) return;
    setLoading(true);

    const ID = list[list.length - 1].id;
    ListAPI({ take: TAKE, lastId: ID, category: null })
      .then((res) => {
        const response: ListType[] = res.data.response.current_list;
        const totalList: ListType[] = [...list, ...response];

        setList(totalList);
      })
      .catch((err) => console.error(err));
    setLoading(false);
  };

  return (
    <>
      <MainContainer>
        <CardsContainer>
          {list.length > 0 ? (
            list.map((el) => {
              console.log("el : ", el);
              return (
                <>
                  <Card
                    id={el.id}
                    category={el.category}
                    title={el.title}
                    nickname={el.nickname}
                    createdAt={el.created_at}
                    content={el.content}
                    reactions={el.reactions}
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
