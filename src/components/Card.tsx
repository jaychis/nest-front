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
          justifyContent: "space-between",
          alignItems: "center",
          width: "800px", // Adjust the width as needed
          minHeight: "300px",
          height: "100%", // Adjust the height as needed
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          margin: "10px",
          borderRadius: "10px", // Adjust for desired curvature of corners
          overflow: "hidden",
        }}
      >
        {/* Card Image */}
        <div
          style={{
            display: "flex", // 이미지와 닉네임을 가로로 배열
            flexDirection: "row", // 가로 방향으로 정렬
            alignItems: "center", // 수직 방향으로 중앙 정렬
            width: "100%", // 부모 요소의 전체 너비를 차지
            // height: "120px", // 원하는 높이 설정
          }}
        >
          <img
            src="image_url_here.jpg" // Replace with your image URL
            style={{
              width: "50px", // Image takes full width of the card
              height: "50px", // Adjust the height as needed
              objectFit: "cover", // Ensures the image covers the area nicely
            }}
          />
          {nickname}
        </div>

        {/* Card Content */}
        <div
          style={{
            padding: "15px",
            textAlign: "center",
          }}
        >
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
