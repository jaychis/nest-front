import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCommunity } from "../../../contexts/CommunityContext";

const CommunityCreatePage2: React.FC = () => {
  const navigate = useNavigate();
  const { communityName, description, banner, setBanner, icon, setIcon } = useCommunity();


  const handleNext = () => {
    // 페이지 2의 데이터를 페이지 3로 전달
    navigate("/community/create3", {
      state: { communityName, description, banner, icon },
    });
  };

  const handleBack = () => {
    navigate("/community/create1");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>배너와 아이콘 업로드</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="banner" style={styles.label}>
            배너 업로드
          </label>
          <input
            type="file"
            id="banner"
            onChange={(e) => setBanner(e.target.files?.[0] || null)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="icon" style={styles.label}>
            아이콘 업로드
          </label>
          <input
            type="file"
            id="icon"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="button" onClick={handleBack} style={styles.cancelButton}>
            이전
          </button>
          <button type="button" onClick={handleNext} style={styles.nextButton}>
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
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #CCC",
    fontSize: "14px",
    backgroundColor: "#F7F7F7",
    boxSizing: "border-box" as "border-box", // box-sizing 추가

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

export default CommunityCreatePage2;
