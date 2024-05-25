import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { useSearchParams } from "react-router-dom";
import { UsersInquiryAPI } from "../api/UserApi";
import { ReactionStateTypes } from "../../_common/CollectionTypes";

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
        width: "80vw",
      }}
    >
      {children}
    </div>
  );
};

const CardsContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "600px",
      }}
    >
      {children}
    </div>
  );
};

interface CardType {
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
    type: ReactionStateTypes;
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

const UsersInquiry = () => {
  const [params, setParams] = useSearchParams();
  const [list, setList] = useState<CardType[]>([]);

  useEffect(() => {
    UsersInquiryAPI({
      nickname: params.get("nickname") as string,
      take: 10,
    })
      .then((res) => {
        const status = res.data.status;

        if (status === 200) {
          const response = res.data.response?.current_list;

          setList(response);
        }
      })
      .catch((err) => console.error(err));
  }, [params]);

  return (
    <MainContainer>
      <CardsContainer>
        {list.length > 0 ? (
          list.map((el) => (
            <Card
              key={el.id}
              id={el.id}
              category={el.category}
              title={el.title}
              nickname={el.nickname}
              createdAt={el.created_at}
              content={el.content}
            />
          ))
        ) : (
          <div>텅</div>
        )}
      </CardsContainer>
    </MainContainer>
  );
};

export default UsersInquiry;
