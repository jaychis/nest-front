import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card, { ReactionType } from "../../components/Card";
import { ReadAPI } from "../api/BoardApi";
import { useSearchParams } from "react-router-dom";
import logo from "../../assets/img/panda_logo.png";
import { ReactionAPI, ReactionCountAPI } from "../api/ReactionApi";

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
}

interface CommentType {
  readonly id: string;
  readonly board_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly category: string;
  readonly replies: ReplyType[];
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null | Date;
}

interface ReplyType {
  readonly id: string;
  readonly comment_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null;
}

const Reply = (re: ReplyType) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
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
    </>
  );
};

const Comment = (co: CommentType) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

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
    </>
  );
};
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
  });

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
    useState<ReactionType>(null);

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
  const [isReplyReaction, setReplyIsReaction] = useState<ReactionType>(null);

  const [isCommentReplyButton, setIsCommentReplyButton] =
    useState<boolean>(false);
  const [isReplyReplyButton, setIsReplyReplyButton] = useState<boolean>(false);

  const reactionReplyButton = async (type: ReactionType) => {
    if (type !== null) {
      const param = {
        boardId: board.id,
        userId: localStorage.getItem("id") as string,
        type,
      };
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

  const reactionCommentButton = async (type: ReactionType) => {
    if (type !== null) {
      const param = {
        boardId: board.id,
        userId: localStorage.getItem("id") as string,
        type,
      };
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

  const renderComments = (comments: CommentType[], commentStatus: boolean) => {
    return (
      <div>
        {comments.map((co) => {
          return (
            <>
              <Comment
                id={co.id}
                board_id={co.board_id}
                content={co.content}
                nickname={co.nickname}
                category={co.category}
                replies={co.replies}
                created_at={co.created_at}
                updated_at={co.updated_at}
                deleted_at={co.deleted_at}
              />
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
                          : "blue",
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
                      backgroundColor: isCardCommentUpHovered
                        ? "#c9c6c5"
                        : "#f5f5f5",
                      border: "none",
                      width: "65px",
                      height: "30px",
                      borderRadius: "30px",
                    }}
                    onClick={() => reactionCommentButton("LIKE")}
                  >
                    좋아요
                  </button>
                  <span
                    style={{ margin: "10px", width: "10px", height: "10px" }}
                  >
                    {isCardCommentCount}
                  </span>
                  <button
                    onMouseEnter={() => setIsCardCommentDownHovered(true)}
                    onMouseLeave={() => setIsCardCommentDownHovered(false)}
                    style={{
                      borderColor: isCardCommentDownHovered
                        ? "blue"
                        : "#e0e0e0",
                      backgroundColor: isCardCommentDownHovered
                        ? "#c9c6c5"
                        : "#f5f5f5",
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
                    onClick={() =>
                      setIsCommentReplyButton(!isCommentReplyButton)
                    }
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
                      backgroundColor: isCardCommentSendHovered
                        ? "#c9c6c5"
                        : "#f5f5f5",
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

              {commentStatus ? (
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
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ) : null}

              <div style={{ marginLeft: "40px" }}>
                {co.replies.length > 0
                  ? renderReplies(co.replies, isReplyReplyButton)
                  : []}
              </div>
            </>
          );
        })}
      </div>
    );
  };
  const renderReplies = (replies: ReplyType[], replyStatus: boolean) => {
    return (
      <div>
        {replies.map((re) => {
          return (
            <>
              <Reply
                id={re.id}
                comment_id={re.comment_id}
                content={re.content}
                nickname={re.nickname}
                created_at={re.created_at}
                updated_at={re.updated_at}
                deleted_at={re.deleted_at}
              />

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
                      backgroundColor: isCardReplyUpHovered
                        ? "#c9c6c5"
                        : "#f5f5f5",
                      border: "none",
                      width: "65px",
                      height: "30px",
                      borderRadius: "30px",
                    }}
                    onClick={() => reactionReplyButton("LIKE")}
                  >
                    좋아요
                  </button>
                  <span
                    style={{ margin: "10px", width: "10px", height: "10px" }}
                  >
                    {isCardReplyCount}
                  </span>
                  <button
                    onMouseEnter={() => setIsCardReplyDownHovered(true)}
                    onMouseLeave={() => setIsCardReplyDownHovered(false)}
                    style={{
                      borderColor: isCardReplyDownHovered ? "blue" : "#e0e0e0",
                      backgroundColor: isCardReplyDownHovered
                        ? "#c9c6c5"
                        : "#f5f5f5",
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
                    onMouseEnter={() => setIsCardReplyReplyHovered(true)}
                    onMouseLeave={() => setIsCardReplyReplyHovered(false)}
                    style={{
                      backgroundColor: isCardReplyReplyHovered
                        ? "#c9c6c5"
                        : "#f5f5f5",
                      border: "none",
                      width: "65px",
                      height: "30px",
                      borderRadius: "30px",
                    }}
                    onClick={() => setIsReplyReplyButton(!isReplyReplyButton)}
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
                    onMouseEnter={() => setIsCardReplyShareHovered(true)}
                    onMouseLeave={() => setIsCardReplyShareHovered(false)}
                    style={{
                      backgroundColor: isCardReplyShareHovered
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
                    onMouseEnter={() => setIsCardReplySendHovered(true)}
                    onMouseLeave={() => setIsCardReplySendHovered(false)}
                    style={{
                      backgroundColor: isCardReplySendHovered
                        ? "#c9c6c5"
                        : "#f5f5f5",
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
              {replyStatus ? (
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
          {board.comments?.length > 0
            ? renderComments(board.comments, isCommentReplyButton)
            : []}
        </div>
      </div>
    </>
  );
};
export default BoardRead;
