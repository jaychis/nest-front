import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { ReadAPI } from "../api/Board.api";
import { useLocation, useSearchParams } from "react-router-dom";

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
}
const BoardRead = () => {
  const [params, setParams] = useSearchParams();
  const [board, setBoard] = useState<CardType>({
    id: "",
    identifier_id: "",
    category: "",
    content: "",
    title: "",
    nickname: "",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  });

  useEffect(() => {
    ReadAPI({
      id: params.get("id") as string,
      title: params.get("title") as string,
    })
      .then((res) => {
        const response = res.data.response;

        console.log("response : ", response);
        setBoard(response);
      })
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    console.log("board : ", board);
  }, [board]);

  return (
    <>
      <GlobalBar />
      <div style={{ display: "flex" }}>
        <GlobalSideBar />
        <div>
          <Card
            key={1}
            category={board.category}
            title={board.title}
            nickname={board.nickname}
            createdAt={board.created_at}
            content={board.content}
          />
        </div>
      </div>
    </>
  );
};
export default BoardRead;
