import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 import합니다.
import { useCommunity } from "../../../contexts/CommunityContext";
import { TagListAPI } from "../../api/TagApi";
import { CommunitySubmitAPI } from "../../api/CommunityApi";


const CommunityCreatePage3: React.FC = () => {
  const navigate = useNavigate(); // useNavigate를 사용하여 navigate 함수를 정의합니다.
  const { communityName, description, banner, icon, topics, setTopics } = useCommunity();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAddTopic = (topic: string) => {
    const formattedTopic = topic.startsWith("#") ? topic : `#${topic}`;
    if (topics.length < 3 && !topics.includes(formattedTopic)) {
      setTopics([...topics, formattedTopic]);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    console.log("topics : ", topics);
    console.log("searchTerm : ", searchTerm);
  }, [topics, searchTerm]);

  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      TagListAPI()
        .then((res) => {
          if (!res) return;
          interface TagListReturnType {
            readonly id: string;
            readonly name: string;
          }
          console.log("TagListAPI response:", res.data);
          const response: TagListReturnType[] = res.data.response;

          const tagNameList: string[] = response.map(
            (el: TagListReturnType) => el.name
          );
          console.log("tagNameList:", tagNameList);

          const filteredTopics = tagNameList.filter((topic: string) =>
            topic.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSuggestions(filteredTopics);
        })
        .catch((err) => console.log("TagListAPI error:", err));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>토픽 추가</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="topicSearch" style={styles.label}>
            토픽 검색
          </label>
          <input
            type="text"
            id="topicSearch"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.input}
          />
          {suggestions.length > 0 && (
            <ul style={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleAddTopic(suggestion)}
                  style={styles.suggestionItem}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {searchTerm && suggestions.length === 0 && (
            <div style={styles.noSuggestions}>
              <p>등록된 토픽이 없습니다. "{searchTerm}"로 새 토픽을 추가할 수 있습니다.</p>
              <button onClick={() => handleAddTopic(searchTerm)} style={styles.addButton}>
                "{searchTerm}" 추가
              </button>
            </div>
          )}
        </div>
        <div style={styles.selectedTopics}>
          {topics.map((topic, index) => (
            <div
              key={index}
              style={{
                ...styles.topicItem,
                padding: topics.length > 1 ? "10px 15px" : "10px 0",
                justifyContent: topics.length > 1 ? "space-between" : "center",
              }}
            >
              <span style={styles.topicText}>{topic}</span>
              <button
                type="button"
                onClick={() => handleRemoveTopic(index)}
                style={{ ...styles.removeButton, display: topics.length > 1 ? "inline-block" : "none" }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate("/community/create2")}
            style={styles.cancelButton}
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => navigate("/community/create4")}
            style={styles.nextButton}
          >
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
    height: "auto",
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
    boxSizing: "border-box" as "border-box",
  },
  suggestionsList: {
    listStyleType: "none" as "none",
    padding: 0,
    marginTop: "10px",
    border: "1px solid #CCC",
    borderRadius: "8px",
    backgroundColor: "#FFF",
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
  },
  noSuggestions: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f8f8f8",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center" as "center",
  },
  addButton: {
    marginTop: "10px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#0079D3",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold" as "bold",
    transition: "background-color 0.3s ease",
  },
  selectedTopics: {
    display: "flex",
    flexWrap: "wrap" as "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  topicItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    borderRadius: "20px",
  },
  topicText: {
    fontSize: "14px",
  },
  removeButton: {
    background: "none",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
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