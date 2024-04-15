import React, { useEffect, useState } from "react";
import { ListAPI } from "../api/Board.api";
import Card from "../../components/Card";

interface ContainerProps {
  children?: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // This centers the cards horizontally
        justifyContent: "flex-start", // This aligns the cards to the top
        paddingTop: "20px", // Add space at the top
        height: "100vh", // Use the full height of the viewport
        width: "100vw", // Use the full width of the viewport
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
        alignItems: "center", // This centers the cards horizontally
        width: "100%", // Full width of its parent
        maxWidth: "600px", // Maximum width of the cards container
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
  readonly deleted_at?: Date;
}
const BoardList = () => {
  const [list, setList] = useState<ListType[]>([]);

  useEffect(() => {
    ListAPI({ take: 3, lastId: null, category: null })
      .then((res) => {
        const response: ListType[] = res.data.response.current_list;

        setList(response);
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
    if (scrollTop + clientHeight >= scrollHeight - 5) {
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
    ListAPI({ take: 3, lastId: ID, category: null })
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
          {list
            ? list.map((el, index) => {
                return (
                  <>
                    <Card
                      key={index}
                      category={el.category}
                      title={el.title}
                      nickname={el.nickname}
                      createdAt={el.created_at}
                      content={el.content}
                    />
                  </>
                );
              })
            : []}
        </CardsContainer>
      </MainContainer>
    </>
  );
};

export default BoardList;
