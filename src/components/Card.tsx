import React from "react";

interface Props {
  readonly key: number;
  readonly category: string;
  readonly content: string;
  readonly nickname: string;
  readonly title: string;
  readonly createdAt: Date;
}

const Card = ({
  key,
  category,
  content,
  createdAt,
  nickname,
  title,
}: Props) => {
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

          {nickname}
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
