import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { ReadAPI } from "../api/BoardApi";
import { useSearchParams } from "react-router-dom";
import {
  CollectionTypes,
  ReactionStateTypes,
} from "../../_common/CollectionTypes";
import {
  CommentListAPI,
  CommentSubmitAPI,
  CommentSubmitParams,
} from "../api/CommentApi";
import BoardComment, { CommentType } from "./BoardComment";
import BoardReply, { ReplyType } from "./BoardReply";

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

const BoardRead = () => {
  const [params, setParams] = useSearchParams();
  const [isBoardState, setIsBoardStateBoard] = useState<CardType>({
    id: params.get("id") as string,
    identifier_id: "",
    category: "",
    content: params.get("content") as string,
    title: params.get("title") as string,
    nickname: "",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    reactions: [],
  });
  const [isCommentState, setIsCommentState] = useState<CommentType[]>([]);

  useEffect(() => {
    const ID: string = isBoardState.id;
    const TITLE: string = isBoardState.title;

    CommentListAPI({ boardId: ID })
      .then((commentRes) => {
        const commentResponse = commentRes.data.response;
        console.log("CommentListAPI commentResponse : ", commentResponse);

        setIsCommentState([...commentResponse]);
      })
      .catch((err) => console.error(err));

    ReadAPI({
      id: ID,
      title: TITLE,
    })
      .then((res) => {
        const response = res.data.response;

        console.log("BoardRead ReadAPI response : ", response);
        setIsBoardStateBoard(response);
      })
      .catch((err) => console.error(err));
  }, []);

  const [writeComment, setWriteComment] = useState<CommentSubmitParams>({
    boardId: params.get("id") as string,
    content: "",
    nickname: localStorage.getItem("nickname") as string,
  });
  const commentHandleChange = (event: CollectionTypes) => {
    const { name, value } = event;

    setWriteComment({
      ...writeComment,
      [name]: value,
    });
  };
  const commentWrite = () => {
    if (!writeComment.content) {
      alert("댓글을 내용을 입력해주세요");
      return;
    } else {
      const param: CommentSubmitParams = {
        boardId: writeComment.boardId,
        content: writeComment.content,
        nickname: writeComment.nickname,
      };

      CommentSubmitAPI(param)
        .then((res) => {
          const response = res.data.response;
          console.log("BoardRead CommentsSubmitAPI response : ", response);

          setIsCommentState([response, ...isCommentState]);

          // setWriteComment({
          //   ...writeComment,
          //   content: "",
          // });
          setWriteComment((prev) => ({
            ...prev,
            content: "",
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  // BoardReply
  const renderReplies = (replies: ReplyType[]) => {
    return (
      <div>
        {replies.map((re) => {
          return (
            <>
              <div key={re.id}>
                <BoardReply
                  id={re.id}
                  comment_id={re.comment_id}
                  content={re.content}
                  nickname={re.nickname}
                  created_at={re.created_at}
                  updated_at={re.updated_at}
                  deleted_at={re.deleted_at}
                />
              </div>
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
              <div key={co.id}>
                <BoardComment
                  id={co.id}
                  board_id={co.board_id}
                  content={co.content}
                  nickname={co.nickname}
                  replies={co.replies}
                  created_at={co.created_at}
                  updated_at={co.updated_at}
                  deleted_at={co.deleted_at}
                  onReplySubmit={handleReplySubmit}
                />

                <div style={{ marginLeft: "40px" }}>
                  {co.replies?.length > 0 ? renderReplies(co.replies) : []}
                </div>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  const handleReplySubmit = (reply: ReplyType) => {
    console.log("handleReplySubmit reply : ", reply);

    setIsCommentState((prevState: CommentType[]) => {
      const a = prevState.map((comment: CommentType) => {
        console.log(
          "comment.id === reply.commentId : ",
          comment.id === reply.comment_id,
        );
        console.log("comment.id : ", comment.id);
        console.log("reply.commentId : ", reply.comment_id);
        console.log("comment :::: ", comment);

        if (comment.id === reply.comment_id) {
          return { ...comment, replies: [...comment.replies, reply] };
        } else {
          return comment;
        }
      });
      console.log("a :: ", a);

      return a;
    });
  };

  return (
    <>
      <GlobalBar />
      <div style={{ display: "flex" }}>
        <GlobalSideBar />
        <div>
          <Card
            id={isBoardState.id}
            category={isBoardState.category}
            title={isBoardState.title}
            nickname={isBoardState.nickname}
            createdAt={isBoardState.created_at}
            content={isBoardState.content}
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
              value={writeComment.content}
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
          {isCommentState?.length > 0 ? renderComments(isCommentState) : []}
        </div>
      </div>
    </>
  );
};
export default BoardRead;
