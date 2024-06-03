import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCommunity } from "../../../contexts/CommunityContext";


const CommunityCreatePage4: React.FC = () => {
  const navigate = useNavigate();
  const { communityName, description, banner, icon, topics } = useCommunity();
  const [visibility, setVisibility] = useState<"public" | "restricted" | "private">("public");
  
  const handleSubmit = () => {
    // 데이터 확인을 위해 콘솔 출력
    console.log("Community Data:", {
      communityName,
      description,
      banner,
      icon,
      topics,
      visibility,
    });

    // 여기에서 모든 데이터를 서버로 전송하는 API 호출을 수행합니다.
    // API 호출이 성공적으로 완료된 후, 메인 페이지로 이동합니다.
    navigate("/");
  };


  const handleBack = () => {
    navigate("/community/create3");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>커뮤니티 공개 설정</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "public"}
              onChange={() => setVisibility("public")}
              style={styles.radio}
            />
            공개
          </label>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="radio"
              name="visibility"
              value="restricted"
              checked={visibility === "restricted"}
              onChange={() => setVisibility("restricted")}
              style={styles.radio}
            />
            제한
          </label>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
              style={styles.radio}
            />
            비공개
          </label>
        </div>
        <div style={styles.buttonGroup}>
          <button type="button" onClick={handleBack} style={styles.cancelButton}>
            이전
          </button>
          <button type="button" onClick={handleSubmit} style={styles.nextButton}>
            완료
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
    height:"400px",
    margin: "50px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
    marginBottom: "20px",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#555",
    fontWeight: "bold" as "bold",
  },
  radio: {
    marginRight: "10px",
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
    transition: "background-color 0.3s ease",
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
    transition: "background-color 0.3s ease",
  },
};

export default CommunityCreatePage4;
