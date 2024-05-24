import React, { useEffect, useState } from "react";
import {
  CollectionTypes,
  ReactionStateTypes,
} from "../../_common/CollectionTypes";
import {
  ReactionAPI,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from "../api/ReactionApi";
import logo from "../../assets/img/panda_logo.png";
import { ReplyType } from "./BoardReply";
import { ReplySubmitAPI, ReplySubmitParams } from "../api/ReplyApi";
import { ReactionType } from "../../components/Card";

export interface CommentType {
  readonly id: string;
  readonly board_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly replies: ReplyType[];
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null | Date;
}

interface BoardCommentProps extends CommentType {
  onReplySubmit: (reply: ReplyType) => void;
}

const BoardComment = (co: BoardCommentProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCardCommentCount, setIsCardCommentCount] = useState<number>(0);
  const [isCardCommentUpHovered, setIsCardCommentUpHovered] =
    useState<boolean>(false);
  const [isCardCommentDownHovered, setIsCardCommentDownHovered] =
    useState<boolean>(false);
  const [isCardCommentReplyHovered, setIsCardCommentReplyHovered] =
    useState<boolean>(false);
  const [isCardCommentShareHovered, setIsCardCommentShareHovered] =
    useState<boolean>(false);
  const [isCardCommentSendHovered, setIsCardCommentSendHovered] =
    useState<boolean>(false);
  const [isCommentReaction, setCommentIsReaction] =
    useState<ReactionStateTypes>(null);
  const [isCommentReplyButton, setIsCommentReplyButton] =
    useState<boolean>(false);

  const USER_ID: string = localStorage.getItem("id") as string;
  const ID: string = co.id;

  const reactionCommentButton = async (type: ReactionStateTypes) => {
    if (type !== null) {
      const param: ReactionParams = {
        boardId: ID,
        userId: USER_ID,
        type,
        reactionTarget: "COMMENT",
      };

      console.log("comment reaction param : ", param);
      ReactionAPI(param)
        .then((res) => {
          const status: number = res.status;
          console.log("status : ", status);

          const type = res.data.response?.type;
          console.log("type : ", type);
          if (type === undefined) setCommentIsReaction(null);
          if (type === "LIKE") setCommentIsReaction("LIKE");
          if (type === "DISLIKE") setCommentIsReaction("DISLIKE");
        })
        .catch((err) => console.error(err));
    }
  };

  const [isReplyState, setIsReplyState] = useState<ReplyType>({
    id: "",
    comment_id: co.id,
    content: "",
    nickname: localStorage.getItem("nickname") as string,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  });
  const replyHandleChange = (event: CollectionTypes) => {
    const { name, value } = event;

    setIsReplyState({
      ...isReplyState,
      [name]: value,
    });
  };
  const replyWrite = () => {
    const param: ReplySubmitParams = {
      commentId: isReplyState.comment_id,
      content: isReplyState.content,
      nickname: isReplyState.nickname,
    };

    ReplySubmitAPI(param)
      .then((res) => {
        const response: ReplyType = res.data.response;
        console.log("ReplySubmitAPI response : ", response);

        co.onReplySubmit(response);
        setIsReplyState({
          ...isReplyState,
          content: "",
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    ReactionListAPI({ boardId: ID })
      .then((res): void => {
        const response = res.data.response;

        response.forEach((el: ReactionType): void => {
          if (USER_ID === el.user_id) {
            setCommentIsReaction(el.type);
          }
        });
      })
      .catch((err) =>
        console.error("BoardComment ReactionListAPI err : ", err),
      );

    ReactionCountAPI({ boardId: ID })
      .then((res): void => {
        const resCount = res.data.response;
        console.log("resCount : ", resCount);

        setIsCardCommentCount(resCount.count);
      })
      .catch((err) =>
        console.error("BoardComment ReactionCountAPI err : ", err),
      );
  }, [isCommentReaction]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "18px" }}>
            <img
              src={logo}
              alt={`${co.nickname}'s avatar`}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "30%",
              }}
            />
          </div>
          <div style={{ fontWeight: "bold", color: "#333" }}>{co.nickname}</div>
        </div>
        <div
          style={{
            backgroundColor: isHovered ? "#f0f0f0" : "white",
            borderRadius: "10px",
            padding: "8px",
            width: "100%",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={{ marginTop: "4px" }}>{co.content}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "1100px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            backgroundColor:
              isCommentReaction === null
                ? "white"
                : isCommentReaction === "LIKE"
                  ? "red"
                  : "#84d7fb",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "20px",
          }}
        >
          <button
            onMouseEnter={() => setIsCardCommentUpHovered(true)}
            onMouseLeave={() => setIsCardCommentUpHovered(false)}
            style={{
              borderColor: isCardCommentUpHovered ? "red" : "#e0e0e0",
              backgroundColor: isCardCommentUpHovered ? "#c9c6c5" : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => reactionCommentButton("LIKE")}
          >
            좋아요
          </button>
          <span style={{ margin: "10px", width: "10px", height: "10px" }}>
            {isCardCommentCount}
          </span>
          <button
            onMouseEnter={() => setIsCardCommentDownHovered(true)}
            onMouseLeave={() => setIsCardCommentDownHovered(false)}
            style={{
              borderColor: isCardCommentDownHovered ? "blue" : "#e0e0e0",
              backgroundColor: isCardCommentDownHovered ? "#c9c6c5" : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => reactionCommentButton("DISLIKE")}
          >
            싫어요
          </button>
        </div>
        <div
          style={{
            marginRight: "10px",
            borderRadius: "30px",
            width: "75px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onMouseEnter={() => setIsCardCommentReplyHovered(true)}
            onMouseLeave={() => setIsCardCommentReplyHovered(false)}
            style={{
              backgroundColor: isCardCommentReplyHovered
                ? "#c9c6c5"
                : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => setIsCommentReplyButton(!isCommentReplyButton)}
          >
            답글
          </button>
        </div>
        <div
          style={{
            marginRight: "10px",
            borderRadius: "30px",
            width: "75px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onMouseEnter={() => setIsCardCommentShareHovered(true)}
            onMouseLeave={() => setIsCardCommentShareHovered(false)}
            style={{
              backgroundColor: isCardCommentShareHovered
                ? "#c9c6c5"
                : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
          >
            공유
          </button>
        </div>
        <div
          style={{
            marginRight: "10px",
            borderRadius: "30px",
            width: "75px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onMouseEnter={() => setIsCardCommentSendHovered(true)}
            onMouseLeave={() => setIsCardCommentSendHovered(false)}
            style={{
              backgroundColor: isCardCommentSendHovered ? "#c9c6c5" : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
          >
            보내기
          </button>
        </div>
      </div>
      {isCommentReplyButton ? (
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
            value={isReplyState.content}
            onChange={(value) =>
              replyHandleChange({
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
              onClick={() => setIsCommentReplyButton(false)}
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
              onClick={replyWrite}
            >
              Comment
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default BoardComment;
