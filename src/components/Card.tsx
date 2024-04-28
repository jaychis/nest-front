import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  readonly id: string;
  readonly category: string;
  readonly content: string;
  readonly nickname: string;
  readonly title: string;
  readonly createdAt: Date;
}

const Card = ({ id, category, content, createdAt, nickname, title }: Props) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "800px",
          minHeight: "200px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          margin: "10px",
          // padding: "10px",
          borderRadius: "10px",
          // overflow: "auto",
          cursor: "pointer",
        }}
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
            src="image_url_here.jpg" // Replace with your image URL
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              marginRight: "10px", // 이미지와 닉네임 사이의 간격
            }}
          />

          <div onClick={() => navigate(`/users/inquiry?nickname=${nickname}`)}>
            {nickname}
          </div>
        </div>

        {/* Card Content */}
        <div
          style={{
            // padding: "0 10px",
            width: "100%",
            overflow: "visible",
            // wordBreak: "break-all",
            // overflowWrap: "break-word",
          }}
        >
          <h3
            style={{
              fontWeight: "bold",
              textAlign: "left",
              whiteSpace: "normal",
            }}
            onClick={() => navigate(`/boards/read?id=${id}&title=${title}`)}
          >
            {title}
          </h3>

          <p
            style={{
              textAlign: "left",
              whiteSpace: "normal",
              wordBreak: "break-word",
              width: "100%",
            }}
          >
            {content}
          </p>
        </div>
      </div>
    </>
  );
};

export default Card;
