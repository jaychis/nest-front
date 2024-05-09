import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { ReactionAPI, ReactionCountAPI } from "../pages/api/ReactionApi";

interface Props {
  readonly id: string;
  readonly category: string;
  readonly content: string;
  readonly nickname: string;
  readonly title: string;
  readonly createdAt: Date;
}

type ReactionType = "LIKE" | "DISLIKE" | null;

const Card = ({ id, category, content, createdAt, nickname, title }: Props) => {
  const navigate = useNavigate();
  const [isCardCount, setIsCardCount] = useState<number>(0);

  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);
  const [isCardUpHovered, setIsCardUpHovered] = useState<boolean>(false);
  const [isCardDownHovered, setIsCardDownHovered] = useState<boolean>(false);
  const [isCardCommentHovered, setIsCardCommentHovered] =
    useState<boolean>(false);
  const [isCardShareHovered, setIsCardShareHovered] = useState<boolean>(false);

  const [isReaction, setIsReaction] = useState<ReactionType>(null);

  const reactionButton = async (type: ReactionType) => {
    if (type !== null) {
      const param = {
        boardId: id,
        userId: localStorage.getItem("id") as string,
        type,
      };
      ReactionAPI(param)
        .then((res) => {
          const status: number = res.status;
          console.log("status : ", status);

          const type = res.data.response?.type;
          console.log("type : ", type);
          if (type === undefined) setIsReaction(null);
          if (type === "LIKE") setIsReaction("LIKE");
          if (type === "DISLIKE") setIsReaction("DISLIKE");
        })
        .catch((err) => console.error(err));
    }
  };

  const goBoardRead = () => navigate(`/boards/read?id=${id}&title=${title}`);

  useEffect(() => {
    console.log("check");
    ReactionCountAPI({
      boardId: id,
    }).then((res) => {
      const resCount = res.data.response;
      console.log("resCount : ", resCount);
      setIsCardCount(resCount);
    });
  }, [isReaction]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "1100px",
          minHeight: "200px",
          margin: "10px",
          borderRadius: "10px",
          cursor: "pointer",
          backgroundColor: isCardHovered ? "#f0f0f0" : "white",
        }}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        {/* Card Image */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            padding: "10px",
          }}
        >
          <img
            src={logo}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              marginRight: "10px", // 이미지와 닉네임 사이의 간격
            }}
          />

          <div
            style={{ fontSize: "15px" }}
            onClick={() => navigate(`/users/inquiry?nickname=${nickname}`)}
          >
            {nickname}
          </div>
        </div>

        {/* Card Content */}
        <div
          style={{
            width: "100%",
            overflow: "visible",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              textAlign: "left",
              whiteSpace: "normal",
              fontSize: "30px",
            }}
            onClick={goBoardRead}
          >
            {title}
          </h3>

          <p
            style={{
              textAlign: "left",
              whiteSpace: "normal",
              wordBreak: "break-word",
              width: "100%",
              fontSize: "20px",
            }}
          >
            {content}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "1100px",
        }}
      >
        <div
          style={{
            backgroundColor:
              isReaction === null
                ? "#C6C6C6"
                : isReaction === "LIKE"
                  ? "red"
                  : "blue",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "20px",
          }}
        >
          <button
            onMouseEnter={() => setIsCardUpHovered(true)}
            onMouseLeave={() => setIsCardUpHovered(false)}
            style={{
              borderColor: isCardUpHovered ? "red" : "#E0E0E0",
              backgroundColor: "#D6D6D6",
              // border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => reactionButton("LIKE")}
          >
            up
          </button>
          <span style={{ margin: "10px", width: "10px", height: "10px" }}>
            {isCardCount}
          </span>
          <button
            onMouseEnter={() => setIsCardDownHovered(true)}
            onMouseLeave={() => setIsCardDownHovered(false)}
            style={{
              borderColor: isCardDownHovered ? "blue" : "#E0E0E0",
              backgroundColor: "#D6D6D6",
              // border: "none",
              width: "65px",
              height: "30px",
              borderRadius: "30px",
            }}
            onClick={() => reactionButton("DISLIKE")}
          >
            down
          </button>
        </div>
        <div
          style={{
            backgroundColor: isCardCommentHovered ? "#E0E0E0" : "#C6C6C6",
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
            onMouseEnter={() => setIsCardCommentHovered(true)}
            onMouseLeave={() => setIsCardCommentHovered(false)}
            style={{
              backgroundColor: isCardCommentHovered ? "#E0E0E0" : "#C6C6C6",
              border: "none",
              height: "100%",
              width: "100%",
              borderRadius: "30px",
            }}
            onClick={goBoardRead}
          >
            댓글
          </button>
        </div>
        <div
          style={{
            backgroundColor: isCardShareHovered ? "#E0E0E0" : "#C6C6C6",
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
            onMouseEnter={() => setIsCardShareHovered(true)}
            onMouseLeave={() => setIsCardShareHovered(false)}
            style={{
              backgroundColor: isCardShareHovered ? "#E0E0E0" : "#C6C6C6",
              border: "none",
              height: "100%",
              width: "100%",
              borderRadius: "30px",
            }}
          >
            공유
          </button>
        </div>
      </div>
      <hr
        style={{
          border: "none",
          height: "2px",
          backgroundColor: "#f0f0f0",
          margin: "16px 0",
          width: "1100px",
        }}
      />
    </>
  );
};

export default Card;
