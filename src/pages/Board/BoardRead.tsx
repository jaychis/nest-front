import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { ReadAPI } from "../api/BoardApi";
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

interface CommentType {
  readonly id: string;
  readonly board_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly category: string;
  readonly replies: [];
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null | Date;
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
  const [comment, setComment] = useState<CommentType>({
    id: "",
    board_id: "",
    content: "",
    nickname: "",
    category: "",
    replies: [],
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

  const renderComments = (comments: CommentType[]) => {
    return (
      <div>
        {comments.map((co) => {
          return (
            <>
              <div>
                <div>
                  <img alt={`${co.nickname}'s avatar`} />
                </div>
                <div>
                  <div>{co.nickname}</div>
                  {/*<div>{co.updated_at}</div>*/}
                  <div>{co.content}</div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <GlobalBar />
      <div style={{ display: "flex" }}>
        <GlobalSideBar />
        <div>
          <Card
            id={board.id}
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
