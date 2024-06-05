import React, { FormEvent, useEffect, useState, useRef } from "react";

import { SubmitAPI, SubmitParams } from "../api/BoardApi";
import { useNavigate } from "react-router-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { AWSImageRegistAPI, getPresignedUrlAPI } from "../api/AWSApi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BoardType } from "../../_common/CollectionTypes";
import RightSideBar from "../Global/RightSideBar";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";

const mdParser = new MarkdownIt();
interface EditorChange {
  html: string;
  text: string;
}

const BoardSubmit = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState<BoardType>("TEXT"); // 기본값은 텍스트
  const editorRef = useRef<HTMLDivElement>(null); // MdEditor의 ref
  const [editorHeight, setEditorHeight] = useState(200); // 에디터 초기 높이

  const ID: string = localStorage.getItem("id") as string;
  const NICKNAME: string = localStorage.getItem("nickname") as string;
  const [board, setBoard] = useState<SubmitParams>({
    title: "",
    content: [],
    category: "",
    identifierId: ID,
    nickname: NICKNAME,
    type: "TEXT",
  });

  // textTitle
  const [textTitle, setTextTitle] = useState<string>("");
  const handleTextTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setTextTitle(value);
  };

  // mediaTitle
  const [mediaTitle, setMediaTitle] = useState<string>("");
  const handleMediaTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setMediaTitle(value);
  };

  // linkTitle
  const [linkTitle, setLinkTitle] = useState<string>("");
  const handleLinkTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setLinkTitle(value);
  };

  // 텍스트
  const [textContent, setTextContent] = useState<string>("");

  const handleEditorChange = async ({ html, text }: EditorChange) => {
    setTextContent(html);

    adjustEditorHeight();
  };
  useEffect(() => console.log("textContent : ", textContent), [textContent]);

  const adjustEditorHeight = () => {
    if (editorRef.current) {
      const editorElement = editorRef.current.querySelector(".rc-md-editor"); // mdEditor root element
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

  // 이미지 & 비디오
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (event.target.files) {
      const files: File[] = Array.from(event.target.files);

      if (files.length === 0) {
        alert("이미지를 선택해주세요.");
        return;
      }

      const previewUrls: string[] = files.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewUrls(previewUrls);
      setFileList(files);
    }
  };

  const imageUrlListDelete = async () => {
    if (previewUrls.length === 0) {
      alert("삭제할 이미지가 없습니다.");
      return;
    }

    setPreviewUrls([]);
  };

  // link
  const [linkContent, setLinkContent] = useState<string>("");
  const handleLinkContentChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setLinkContent(value);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();

    const paramObj: {
      category: string;
      title: string;
      content: string[];
      identifierId: string;
      nickname: string;
      type: BoardType;
    } = {
      identifierId: ID,
      content: [],
      title: "",
      category: "경제",
      nickname: NICKNAME,
      type: "TEXT",
    };

    try {
      if (inputType === "TEXT") {
        paramObj.title = textTitle;
        paramObj.content = [textContent];
      }

      if (inputType === "MEDIA") {
        console.log("check MEDIA");
        const files: File[] = Array.from(fileList);

        const uploadImageUrlList = files.map(async (file: File) => {
          const key: string = `uploads/${new Date().toISOString()}/${file.name}`;
          console.log("key : ", key);
          const expires: number = 60;
          const res = await getPresignedUrlAPI({ key, expires });
          console.log("res : ", res);
          const presignedUrl = res.data.response.url;
          console.log("presignedUrl: ", presignedUrl);

          const uploadResult = await AWSImageRegistAPI({
            url: presignedUrl,
            file,
          });
          console.log("uploadResult : ", uploadResult);

          if (uploadResult.ok) {
            const imageUrl = presignedUrl.split("?")[0];
            console.log("imageUrl : ", imageUrl);

            return imageUrl;
          } else {
            console.error("Failed to upload file", uploadResult.statusText);
          }
        });
        console.log("uploadImageUrlList : ", uploadImageUrlList);

        const imageUrls: string[] = await Promise.all(uploadImageUrlList);
        console.log("imageUrls : ", imageUrls);

        for (let i: number = 0; i < imageUrls.length; ++i)
          if (!imageUrls[i]) {
            console.log("imageUrls 값이 없음");
            return;
          }

        paramObj.content = imageUrls;
        paramObj.title = mediaTitle;
        paramObj.type = "MEDIA";
        console.log("midia paramObj : ", paramObj);
      }

      if (inputType === "LINK") {
        paramObj.title = linkTitle;
        paramObj.content = [linkContent];
        paramObj.type = "LINK";
      }

      if (inputType === "YOUTUBE") {
        //
      }

      SubmitAPI(paramObj)
        .then((res) => {
          const response = res.data.response;

          if (res.status === 201) {
            navigate(`/boards/read?id=${response.id}&title=${response.title}`);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.error("Error : ", error);
    }
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
    minHeight: "50px", // 기본 높이를 작게 설정
    maxHeight: "700px", // 최대 높이를 설정
    overflowY: "auto" as "auto", // 최대 높이를 넘으면 스크롤이 생기도록 설정
    resize: "none", // 사용자가 높이를 조정할 수 없도록 설정
  };

  const submitButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#84d7fb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "0 0",
    border: "1px solid #fff",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#0079D3",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#84d7fb",
    color: "white",
    border: "#84d7fb",
  };

  const sliderSetting = {
    dots: true,
    infinite: previewUrls.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  useEffect(() => {
    console.log("inputType : ", inputType);
  }, [inputType]);
  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flex: 2 }}>
          <div style={{ backgroundColor: "#4F657755", minHeight: "100vh" }}>
            <GlobalBar />
            <div style={{ display: "flex", width: "100%" }}>
              <GlobalSideBar />
              <div style={{ flex: 2 }}>
                <div
                  style={{
                    marginTop: "20px",
                    width: "1000px",
                    height: "auto",
                    margin: "20px auto",
                    padding: "30px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <button
                      onClick={() => setInputType("TEXT")}
                      style={
                        inputType === "TEXT" ? activeButtonStyle : buttonStyle
                      }
                    >
                      텍스트
                    </button>
                    <button
                      onClick={() => setInputType("MEDIA")}
                      style={
                        inputType === "MEDIA" ? activeButtonStyle : buttonStyle
                      }
                    >
                      이미지 & 비디오
                    </button>
                    <button
                      onClick={() => setInputType("LINK")}
                      style={
                        inputType === "LINK" ? activeButtonStyle : buttonStyle
                      }
                    >
                      링크
                    </button>
                  </div>
                  {inputType === "TEXT" && (
                    <>
                      <input
                        name="title"
                        type="text"
                        placeholder="제목"
                        onChange={handleTextTitleChange}
                        style={inputStyle}
                      />
                      <MdEditor
                        style={{ height: "200px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={handleEditorChange}
                        view={{ menu: true, md: true, html: false }}
                      />
                    </>
                  )}
                  {inputType === "MEDIA" && (
                    <>
                      <input
                        name="title"
                        type="text"
                        placeholder="제목"
                        onChange={handleMediaTitleChange}
                        style={inputStyle}
                      />

                      {previewUrls.length > 0 ? (
                        <>
                          <button onClick={imageUrlListDelete}>휴지통</button>
                          <Slider {...sliderSetting}>
                            {previewUrls.map((image, index) => (
                              <div key={index}>
                                <img
                                  src={image}
                                  alt={`Preview image ${index}`}
                                  style={{ height: "400px", width: "400px" }}
                                />
                              </div>
                            ))}
                          </Slider>
                        </>
                      ) : (
                        <>
                          <input
                            type={"file"}
                            multiple
                            onChange={handleFileChange}
                            style={inputStyle}
                          />
                        </>
                      )}
                    </>
                  )}
                  {inputType === "LINK" && (
                    <>
                      <input
                        name="title"
                        type="text"
                        placeholder="제목"
                        onChange={handleLinkTitleChange}
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        placeholder="링크 추가"
                        onChange={(e) => handleLinkContentChange(e)}
                        style={inputStyle}
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    style={submitButtonStyle}
                    onClick={(e) => handleSubmit(e)}
                  >
                    보내기
                  </button>
                </div>
              </div>
              <RightSideBar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardSubmit;
