import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CommunityCreate: React.FC = () => {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 커뮤니티 추가 API 호출 로직을 여기에 작성합니다.
    // 성공적으로 커뮤니티를 추가한 후 메인 페이지로 이동합니다.
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>커뮤니티 만들기</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="communityName" style={styles.label}>커뮤니티 이름</label>
          <input
            type="text"
            id="communityName"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>설명</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="button" onClick={handleCancel} style={styles.cancelButton}>
            취소
          </button>
          <button type="submit" style={styles.nextButton}>
            다음
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#FFFFFF",
    padding: "20px",
    maxWidth: "600px",
    margin: "50px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // 그림자 효과를 더 부드럽게 변경
    borderRadius: "8px",
    border: "1px solid #EDEDED",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center" as "center",
  },
  form: {
    display: "flex",
    flexDirection: "column" as "column",
  },
  formGroup: {
    marginBottom: "20px", // 여백을 좀 더 추가하여 폼의 요소를 분리
  },
  label: {
    marginBottom: "8px", // 여백을 좀 더 추가하여 레이블과 입력 필드를 분리
    fontSize: "14px",
    color: "#555",
    fontWeight: "bold" as "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px", // 경계선 둥글기를 좀 더 둥글게 변경
    border: "1px solid #CCC",
    fontSize: "14px",
    backgroundColor: "#F7F7F7", // 레딧 스타일의 입력 필드 배경색
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #CCC",
    fontSize: "14px",
    minHeight: "120px", // 텍스트 영역의 최소 높이를 조금 더 늘림
    backgroundColor: "#F7F7F7",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "12px 20px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#CCC",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold" as "bold",
    transition: "background-color 0.3s ease", // 버튼 배경색 변경 시 애니메이션 추가
  },
  nextButton: {
    padding: "12px 20px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#0079D3",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold" as "bold",
    transition: "background-color 0.3s ease", // 버튼 배경색 변경 시 애니메이션 추가
  },
};

export default CommunityCreate;