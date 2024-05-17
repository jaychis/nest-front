import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { ReadAPI } from "../api/BoardApi";
import { useSearchParams } from "react-router-dom";
import { CollectionTypes, ReactionTypes } from "../../_common/CollectionTypes";
import { CommentsSubmitAPI, CommentsSubmitParams } from "../api/CommentsApi";
import BoardComment, { CommentType } from "./BoardComment";
import BoardReply, { ReplyType } from "./BoardReply";

interface CardType {
  readonly id: string;
  readonly identifier_id: string;
  readonly category: string;
  readonly content: string;
  readonly title: string;
  readonly nickname: string;
  readonly comments: CommentType[];
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

const BoardRead = () => {
  const [params, setParams] = useSearchParams();
  const [board, setBoard] = useState<CardType>({
    id: params.get("id") as string,
    identifier_id: "",
    category: "",
    content: params.get("content") as string,
    title: params.get("title") as string,
    nickname: "",
    comments: [],
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    reactions: [],
  });

  useEffect(() => {
    const ID: string = board.id;
    const TITLE: string = board.title;

    ReadAPI({
      id: ID,
      title: TITLE,
    })
      .then((res) => {
        const response = res.data.response;

        console.log("response : ", response);
        setBoard(response);
      })
      .catch((err) => console.error(err));
  }, []);

  const [isCommentState, setIsCommentState] = useState<CommentType>({
    id: "",
    boardId: board.id,
    content: "",
    nickname: localStorage.getItem("nickname") as string,
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });
  const commentHandleChange = (event: CollectionTypes) => {
    const { name, value } = event;

    setIsCommentState({
      ...isCommentState,
      [name]: value,
    });
  };
  const commentWrite = () => {
    const param: CommentsSubmitParams = {
      boardId: isCommentState.boardId,
      content: isCommentState.content,
      nickname: isCommentState.nickname,
    };

    CommentsSubmitAPI(param)
      .then((res) => {
        const response = res.data.response;
        console.log("response : ", response);

        setIsCommentState(response);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  // BoardReply
  const renderReplies = (replies: ReplyType[]) => {
    return (
      <div>
        {replies.map((re) => {
          return (
            <>
              <BoardReply
                id={re.id}
                commentId={re.commentId}
                content={re.content}
                nickname={re.nickname}
                createdAt={re.createdAt}
                updatedAt={re.updatedAt}
                deletedAt={re.deletedAt}
              />
            </>
          );
        })}
      </div>
    );
  };

  // Comments
  const renderComments = (comments: CommentType[]) => {
    return (
      <div>
        {comments.map((co) => {
          return (
            <>
              <BoardComment
                id={co.id}
                boardId={co.boardId}
                content={co.content}
                nickname={co.nickname}
                replies={co.replies}
                createdAt={co.createdAt}
                updatedAt={co.updatedAt}
                deletedAt={co.deletedAt}
              />

              <div style={{ marginLeft: "40px" }}>
                {co.replies.length > 0 ? renderReplies(co.replies) : []}
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
            reactions={board.reactions}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              margin: "10px",
              border: "3px solid #ccc",
              borderRadius: "30px",
              padding: "10px",
            }}
          >
            <textarea
              style={{
                width: "100%",
                border: "none",
                borderRadius: "14px",
                resize: "vertical",
                boxSizing: "border-box",
                outline: "none",
              }}
              name={"content"}
              onChange={(value) =>
                commentHandleChange({
                  name: value.target.name,
                  value: value.target.value,
                })
              }
            ></textarea>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <button
                style={{
                  padding: "6px 12px",
                  marginLeft: "5px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "6px 12px",
                  marginLeft: "5px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  backgroundColor: "#007BFF",
                  color: "white",
                }}
                onClick={commentWrite}
              >
                Comment
              </button>
            </div>
          </div>
          {board.comments?.length > 0 ? renderComments(board.comments) : []}
        </div>
      </div>
    </>
  );
};
export default BoardRead;
