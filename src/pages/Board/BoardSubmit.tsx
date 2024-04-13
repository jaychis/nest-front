import React from "react";

const BoardSubmit = () => {
  const handleSubmit = () => {
    // event.preventDefault();
    // Form 제출 로직
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <form onScroll={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              margin: 0,
              paddingBottom: "10px",
              borderBottom: "1px solid #eee",
            }}
          >
            게시판 글 작성
          </h2>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="제목"
            style={{
              width: "100%",
              marginBottom: "10px",
              paddingTop: "10px",
              paddingBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <textarea
            placeholder="본문(선택사항)"
            style={{
              width: "100%",
              marginBottom: "10px",
              paddingTop: "10px",
              paddingBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              minHeight: "100px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#ddd",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            보내기
          </button>
        </div>
      </form>
    </div>
  );
};
export default BoardSubmit;
