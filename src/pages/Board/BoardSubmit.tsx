import React, { FormEvent, useEffect, useState } from "react";
import BoardBar from "./BoardBar";
import { SubmitAPI, SubmitParams } from "../api/BoardApi";
import { useNavigate } from "react-router-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { getPresignedUrlAPI } from "../api/PresignedUrlApi";

const mdParser = new MarkdownIt();

const BoardSubmit = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("TEXT"); // 기본값은 텍스트

  const ID: string = localStorage.getItem("id") as string;
  const NICKNAME: string = localStorage.getItem("nickname") as string;
  const [board, setBoard] = useState<SubmitParams>({
    title: "",
    content: "",
    category: "",
    identifierId: ID,
    nickname: NICKNAME,
    images: [],
    videos: [],
    links: [],
    youtubeLinks: [],
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const key: string = `uploads/${ID}-${file.name}`;
    const expired: number = 600;
    getPresignedUrlAPI({ key, expired })
      .then((res): void => {
        const presignedUrl = res.data;
        console.log("presignedUrl : ", presignedUrl);

        // const uploadResponse = await fetch(presignedUrl, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': file.type,
        //   },
        //   body: file,
        // });
        //
        // if (uploadResponse.ok) {
        //   // 파일 업로드가 성공하면 미리보기
        //   const imageUrl = presignedUrl.split('?')[0];  // 쿼리 파라미터를 제거하여 이미지 URL을 얻습니다
        //   setPreviewUrl(imageUrl);
        // } else {
        //   alert('Failed to upload file.');
        // }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    console.log("board : ", board);
  }, [board]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setBoard({
      ...board,
      [name]: value,
    });
  };

  const handleMediaChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setBoard((prev) => ({
      ...prev,
      images: [...prev.images, ...files], // Assuming handling for both images and videos
      videos: [...prev.videos, ...files], // Same as above
    }));
  };

  const handleLinkChange = (
    value: string,
    type: "links" | "youtubeLinks",
  ): void => {
    setBoard((prev) => ({
      ...prev,
      [type]: [...prev[type], value],
    }));
  };

  interface EditorChange {
    html: string;
    text: string;
  }

  const handleEditorChange = ({ html, text }: EditorChange) => {
    setBoard((prev) => ({
      ...prev,
      content: text,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit board : ", board);
    SubmitAPI(board)
      .then((res) => {
        const response = res.data.response;
        if (res.status === 201) {
          navigate(`/boards/read?id=${response.id}&title=${response.title}`);
        }
      })
      .catch((err) => console.error(err));
  };

  const inputStyle = {
    width: "100%",
    height: "30px",
    marginBottom: "10px",
    paddingTop: "10px",
    paddingBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    height: "400px",
  };

  const submitButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#ddd",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <>
      <div style={{ backgroundColor: "#4F657755", height: "100vh" }}>
        <BoardBar />

        {/*prevuewUrl 테스트용*/}
        {previewUrl && (
          <img
            id={"preview"}
            src={previewUrl}
            alt={"Image Preview"}
            style={{ display: "block" }}
          />
        )}
        {/**/}

        <div
          style={{
            marginTop: "20px",
            width: "1000px",
            height: "70vh",
            margin: "20px auto",
            padding: "30px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setInputType("TEXT")}>텍스트</button>
            <button onClick={() => setInputType("MEDIA")}>
              이미지 & 비디오
            </button>
            <button onClick={() => setInputType("LINK")}>링크</button>
          </div>
          <form onSubmit={handleSubmit}>
            {inputType === "TEXT" && (
              <>
                <input
                  name="title"
                  type="text"
                  placeholder="제목"
                  onChange={handleChange}
                  style={inputStyle}
                />
                <MdEditor
                  style={{ height: "500px" }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                />
              </>
            )}
            {inputType === "MEDIA" && (
              <>
                <input
                  name="title"
                  type="text"
                  placeholder="제목"
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  multiple
                  style={inputStyle}
                />
              </>
            )}
            {inputType === "LINK" && (
              <>
                <input
                  name="title"
                  type="text"
                  placeholder="제목"
                  onChange={handleChange}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="링크 추가"
                  onChange={(e) => handleLinkChange(e.target.value, "links")}
                  style={inputStyle}
                />
              </>
            )}
            <button type="submit" style={submitButtonStyle}>
              보내기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BoardSubmit;
