import React, { useEffect, useState } from "react";
import { ReactionStateTypes } from "../../_common/CollectionTypes";
import {
  ReactionAPI,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from "../api/ReactionApi";
import logo from "../../assets/img/panda_logo.png";
import { ReactionType } from "../../components/Card";

export interface ReplyType {
  readonly id: string;
  readonly comment_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null;
}

const BoardReply = (re: ReplyType) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCardReplyCount, setIsCardReplyCount] = useState<number>(0);
  const [isCardReplyUpHovered, setIsCardReplyUpHovered] =
    useState<boolean>(false);
  const [isCardReplyDownHovered, setIsCardReplyDownHovered] =
    useState<boolean>(false);
  const [isCardReplyReplyHovered, setIsCardReplyReplyHovered] =
    useState<boolean>(false);
  const [isCardReplyShareHovered, setIsCardReplyShareHovered] =
    useState<boolean>(false);
  const [isCardReplySendHovered, setIsCardReplySendHovered] =
    useState<boolean>(false);
  const [isReplyReaction, setReplyIsReaction] =
    useState<ReactionStateTypes>(null);

  const [isReplyReplyButton, setIsReplyReplyButton] = useState<boolean>(false);

  const ID: string = re.id;
  const USER_ID: string = localStorage.getItem("id") as string;

  const reactionReplyButton = async (type: ReactionStateTypes) => {
    if (type !== null) {
      const param: ReactionParams = {
        boardId: ID,
        userId: USER_ID,
        type,
        reactionTarget: "REPLY",
      };

      console.log("reply reaction param : ", param);
      ReactionAPI(param)
        .then((res) => {
          const status: number = res.status;
          console.log("status : ", status);

          const type = res.data.response?.type;
          console.log("type : ", type);
          if (type === undefined) setReplyIsReaction(null);
          if (type === "LIKE") setReplyIsReaction("LIKE");
          if (type === "DISLIKE") setReplyIsReaction("DISLIKE");
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    ReactionListAPI({ boardId: ID })
      .then((res): void => {
        const response = res.data.response;

        response.forEach((el: ReactionType): void => {
          if (USER_ID === el.user_id) {
            setReplyIsReaction(el.type);
          }
        });
      })
      .catch((err) => console.error("BoardReply ReactionListAPI err : ", err));

    ReactionCountAPI({ boardId: ID })
      .then((res): void => {
        const resCount = res.data.response;

        setIsCardReplyCount(resCount.count);
      })
      .catch((err) => console.error("BoardReply ReactionCountAPI err : ", err));
  }, [isReplyReaction]);

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
              alt={`${re.nickname}'s avatar`}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "30%",
              }}
            />
          </div>
          <div style={{ fontWeight: "bold", color: "#333" }}>{re.nickname}</div>
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
          <div style={{ marginTop: "4px" }}>{re.content}</div>
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
              isReplyReaction === null
                ? "white"
                : isReplyReaction === "LIKE"
                  ? "red"
                  : "blue",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "20px",
          }}
        >
          <button
            onMouseEnter={() => setIsCardReplyUpHovered(true)}
            onMouseLeave={() => setIsCardReplyUpHovered(false)}
            style={{
              borderColor: isCardReplyUpHovered ? "red" : "#e0e0e0",
              backgroundColor: isCardReplyUpHovered ? "#c9c6c5" : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => reactionReplyButton("LIKE")}
          >
            좋아요
          </button>
          <span style={{ margin: "10px", width: "10px", height: "10px" }}>
            {isCardReplyCount}
          </span>
          <button
            onMouseEnter={() => setIsCardReplyDownHovered(true)}
            onMouseLeave={() => setIsCardReplyDownHovered(false)}
            style={{
              borderColor: isCardReplyDownHovered ? "blue" : "#e0e0e0",
              backgroundColor: isCardReplyDownHovered ? "#c9c6c5" : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => reactionReplyButton("DISLIKE")}
          >
            싫어요
          </button>
        </div>
        {/*<div*/}
        {/*  style={{*/}
        {/*    marginRight: "10px",*/}
        {/*    borderRadius: "30px",*/}
        {/*    width: "75px",*/}
        {/*    height: "50px",*/}
        {/*    display: "flex",*/}
        {/*    justifyContent: "center",*/}
        {/*    alignItems: "center",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <button*/}
        {/*    onMouseEnter={() => setIsCardReplyReplyHovered(true)}*/}
        {/*    onMouseLeave={() => setIsCardReplyReplyHovered(false)}*/}
        {/*    style={{*/}
        {/*      backgroundColor: isCardReplyReplyHovered ? "#c9c6c5" : "#f5f5f5",*/}
        {/*      border: "none",*/}
        {/*      width: "65px",*/}
        {/*      height: "30px",*/}
        {/*      borderRadius: "30px",*/}
        {/*    }}*/}
        {/*    onClick={() => setIsReplyReplyButton(!isReplyReplyButton)}*/}
        {/*  >*/}
        {/*    답글*/}
        {/*  </button>*/}
        {/*</div>*/}
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
            onMouseEnter={() => setIsCardReplyShareHovered(true)}
            onMouseLeave={() => setIsCardReplyShareHovered(false)}
            style={{
              backgroundColor: isCardReplyShareHovered ? "#c9c6c5" : "#f5f5f5",
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
            onMouseEnter={() => setIsCardReplySendHovered(true)}
            onMouseLeave={() => setIsCardReplySendHovered(false)}
            style={{
              backgroundColor: isCardReplySendHovered ? "#c9c6c5" : "#f5f5f5",
              border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => alert("BoardReply Button Click")}
          >
            보내기
          </button>
        </div>
      </div>
      {isReplyReplyButton ? (
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
              onClick={() => setIsReplyReplyButton(false)}
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
            >
              Comment
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default BoardReply;
