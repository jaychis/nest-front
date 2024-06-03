import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { ReadAPI } from "../api/BoardApi";
import { useSearchParams } from "react-router-dom";
import { CardType, CollectionTypes } from "../../_common/CollectionTypes";
import {
  CommentListAPI,
  CommentSubmitAPI,
  CommentSubmitParams,
} from "../api/CommentApi";
import BoardComment, { CommentType } from "./BoardComment";
import BoardReply, { ReplyType } from "./BoardReply";
import RightSideBar from "../Global/RightSideBar";

const BoardRead = () => {
  const [params, setParams] = useSearchParams();
  const [isBoardState, setIsBoardStateBoard] = useState<CardType>({
    id: params.get("id") as string,
    identifier_id: "",
    category: "",
    content: [],
    title: params.get("title") as string,
    nickname: "",
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    type: "TEXT",
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

        setIsBoardStateBoard(response);
      })
      .catch((err) => console.error(err));
  }, []);

  const [writeComment, setWriteComment] = useState<CommentSubmitParams>({
    boardId: params.get("id") as string,
    content: "",
    nickname: (localStorage.getItem("nickname") as string) || "",
    userId: (localStorage.getItem("id") as string) || "",
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
        userId: writeComment.userId,
        content: writeComment.content,
        nickname: writeComment.nickname,
      };

      CommentSubmitAPI(param)
        .then((res) => {
          const response = res.data.response;

          setIsCommentState([response, ...isCommentState]);

          setWriteComment((prev) => ({
            ...prev,
            content: "",
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  const renderReplies = (replies: ReplyType[]) => {
    return (
      <div>
        {replies.map((re: ReplyType) => (
          <div key={re.id}>
            <BoardReply
              id={re.id}
              comment_id={re.comment_id}
              user_id={re.user_id}
              content={re.content}
              nickname={re.nickname}
              created_at={re.created_at}
              updated_at={re.updated_at}
              deleted_at={re.deleted_at}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderComments = (comments: CommentType[]) => {
    return (
      <div>
        {comments.map((co) => (
          <div key={co.id}>
            <BoardComment
              id={co.id}
              board_id={co.board_id}
              user_id={co.user_id}
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
        ))}
      </div>
    );
  };

  const handleReplySubmit = (reply: ReplyType) => {
    setIsCommentState((prevState: CommentType[]) => {
      const updatedComments = prevState.map((comment: CommentType) => {
        if (comment.id === reply.comment_id) {
          return { ...comment, replies: [...comment.replies, reply] };
        } else {
          return comment;
        }
      });

      return updatedComments;
    });
  };

  return (
    <>
      <GlobalBar />
      <div style={{ display: "flex", width: "100%" }}>
        <GlobalSideBar />
        <div style={{ flex: 2 }}>
          <Card
            id={isBoardState.id}
            category={isBoardState.category}
            title={isBoardState.title}
            nickname={isBoardState.nickname}
            createdAt={isBoardState.created_at}
            content={isBoardState.content}
            type={isBoardState.type}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
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
                  backgroundColor: "#84d7fb",
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
        <RightSideBar />
      </div>
    </>
  );
};

export default BoardRead;
