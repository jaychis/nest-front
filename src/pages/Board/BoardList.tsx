import React, { useEffect, useState } from "react";
import { ListAPI } from "../api/BoardApi";
import Card from "../../components/Card";
import { mockingList } from "../../_common/mocking/BoardMocking";

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
}

const BoardList = () => {
  const [list, setList] = useState<ListType[]>([]);
  const TAKE: number = 6;

  useEffect(() => {
    ListAPI({ take: TAKE, lastId: null, category: null })
      .then((res) => {
        const response: ListType[] = res.data.response.current_list;

        setList([...response, ...mockingList]);
      })
      .catch((err) => console.error(err));

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
              return (
                <>
                  <Card
                    id={el.id}
                    category={el.category}
                    title={el.title}
                    nickname={el.nickname}
                    createdAt={el.created_at}
                    content={el.content}
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
