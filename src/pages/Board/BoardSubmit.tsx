import React, { FormEvent, useEffect, useState } from "react";
import BoardBar from "./BoardBar";
import { SubmitAPI, SubmitParams } from "../api/BoardApi";
import { useNavigate } from "react-router-dom";
import { HandleChangeType } from "../../_common/HandleChangeType";
import { ProfileAPI } from "../api/UserApi";

const BoardSubmit = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<SubmitParams>({
    title: "",
    content: "",
    category: "",
    identifierId: "",
    nickname: "",
  });

  useEffect(() => {
    ProfileAPI({ id: localStorage.getItem("access_token") as string })
      .then((res) => {
        const response = res.data.response;
        console.log("response : ", response);

        console.log("res.data : ", res.data);

        setBoard({
          ...board,
          identifierId: response.identifier_id,
          nickname: response.nickname,
        });
      })
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    console.log("board : ", board);
  }, [board]);
  const handleChange = (event: HandleChangeType): void => {
    const { name, value } = event;
    setBoard({
      ...board,
      [name]: value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    SubmitAPI(board)
      .then((res) => {
        const response = res.data.response;

        if (res.status === 201) {
          navigate(`/boards/read?id=${response.id}&title=${response.title}`);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div style={{ backgroundColor: "#4F657755", height: "100vh" }}>
        <BoardBar />
        <div
          style={{
            marginTop: "20px",
            width: "1000px",
            height: "50vh",
            margin: "20px auto",
            padding: "30px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <form onSubmit={handleSubmit}>
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
                name={"title"}
                type="text"
                placeholder="제목"
                onChange={(value) =>
                  handleChange({
                    name: value.target.name,
                    value: value.target.value,
                  })
                }
                style={{
                  width: "100%",
                  height: "30px",
                  marginBottom: "10px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <textarea
                placeholder="본문(선택사항)"
                name={"content"}
                onChange={(value) =>
                  handleChange({
                    name: value.target.name,
                    value: value.target.value,
                  })
                }
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  minHeight: "100px",
                  height: "400px",
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
      </div>
    </>
  );
};
export default BoardSubmit;
