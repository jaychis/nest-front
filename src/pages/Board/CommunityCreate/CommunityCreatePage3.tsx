import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCommunity } from "../../../contexts/CommunityContext";

const CommunityCreatePage3: React.FC = () => {
  const navigate = useNavigate();
  const { communityName, description, banner, icon, topics, setTopics } = useCommunity();


  const handleAddTopic = () => {
    if (topics.length < 3) {
      setTopics([...topics, ""]);
    }
  };

  const handleChangeTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleNext = () => {
    navigate("/community/create4", {
      state: { communityName, description, banner, icon, topics },
    });
  };

  const handleBack = () => {
    navigate("/community/create2");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>토픽 추가</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        {topics.map((topic, index) => (
          <div key={index} style={styles.formGroup}>
            <label htmlFor={`topic-${index}`} style={styles.label}>
              토픽 {index + 1}
            </label>
            <input
              type="text"
              id={`topic-${index}`}
              value={topic}
              onChange={(e) => handleChangeTopic(index, e.target.value)}
              required
              style={styles.input}
            />
          </div>
        ))}
        {topics.length < 3 && (
          <button type="button" onClick={handleAddTopic} style={styles.addButton}>
            토픽 추가
          </button>
        )}
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
  addButton: {
    margin: "10px 0",
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

export default CommunityCreatePage3;
