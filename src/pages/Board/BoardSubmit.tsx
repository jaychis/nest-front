import React, { FormEvent, useEffect, useState, useRef } from "react";
import BoardBar from "./BoardBar";
import { SubmitAPI, SubmitParams } from "../api/BoardApi";
import { useNavigate } from "react-router-dom";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

const BoardSubmit = () => {
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null); // MdEditor의 ref
  const [inputType, setInputType] = useState('TEXT'); // 기본값은 텍스트
  const [editorHeight, setEditorHeight] = useState(200); // 에디터 초기 높이
  
  const [board, setBoard] = useState<SubmitParams>({
    title: "",
    content: "",
    category: "",
    identifierId: localStorage.getItem("id") as string,
    nickname: localStorage.getItem("nickname") as string,
    images: [],
    videos: [],
    links: [],
    youtubeLinks: []
  });

  useEffect(() => {
    console.log("board : ", board);
  }, [board]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setBoard({
      ...board,
      [name]: value,
    });
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setBoard(prev => ({
      ...prev,
      images: [...prev.images, ...files], // Assuming handling for both images and videos
      videos: [...prev.videos, ...files]  // Same as above
    }));
  };

  const handleLinkChange = (value: string, type: 'links' | 'youtubeLinks'): void => {
    setBoard(prev => ({
      ...prev,
      [type]: [...prev[type], value]
    }));
  };

  interface EditorChange {
    html: string;
    text: string;
  }
  
  const handleEditorChange = ({ html, text }: EditorChange) => {
    setBoard(prev => ({
      ...prev,
      content: text
    }));
    adjustEditorHeight();
  };

  const adjustEditorHeight = () => {
    if (editorRef.current) {
      const editorElement = editorRef.current.querySelector('.rc-md-editor'); // mdEditor root element
      if (editorElement) {
        const scrollHeight = editorElement.scrollHeight;
        const newHeight = Math.min(scrollHeight, 700); // 최대 높이 700px
        setEditorHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    adjustEditorHeight();
  }, [board.content]);

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

  const inputStyle= {
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
    minHeight: "50px", // 기본 높이를 작게 설정
    maxHeight: "700px", // 최대 높이를 설정
    overflowY: "auto" as 'auto', // 최대 높이를 넘으면 스크롤이 생기도록 설정
    resize: "none" // 사용자가 높이를 조정할 수 없도록 설정
  };

  const submitButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#0079D3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px"
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "0 0",
    border: "1px solid #0079D3",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#0079D3",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s"
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007BFF",
    color: "white"
  };
  return (
    <>
      <div style={{ backgroundColor: "#4F657755", height: "100vh" }}>
        <BoardBar />
        <div style={{
          marginTop: "20px",
          width: "1000px",
          height: "70vh",
          margin: "20px auto",
          padding: "30px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#fff",
        }}>
           <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
            <button
              onClick={() => setInputType('TEXT')}
              style={inputType === 'TEXT' ? activeButtonStyle : buttonStyle}
            >
              텍스트
            </button>
            <button
              onClick={() => setInputType('MEDIA')}
              style={inputType === 'MEDIA' ? activeButtonStyle : buttonStyle}
            >
              이미지 & 비디오
            </button>
            <button
              onClick={() => setInputType('LINK')}
              style={inputType === 'LINK' ? activeButtonStyle : buttonStyle}
            >
              링크
            </button>
          </div>
          <form onSubmit={handleSubmit}>
          {inputType === 'TEXT' && (
              <>
                <input
                  name="title"
                  type="text"
                  placeholder="제목"
                  onChange={handleChange}
                  style={inputStyle}
                />
                <MdEditor
                  style={{ height: `${editorHeight}px` }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                  view={{ menu: true, md: true, html: false }}
                />
              </>
            )}
              {inputType === 'MEDIA' && (
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
            {inputType === 'LINK' && (
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
                    onChange={(e) => handleLinkChange(e.target.value, 'links')}
                    style={inputStyle}
                  />
              </>
            )}
            <button type="submit" style={submitButtonStyle}>보내기</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BoardSubmit;