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
import {
  AwsImageUploadFunctionality,
  AwsImageUploadFunctionalityReturnType,
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsDelete,
  ImageLocalPreviewUrlsDeleteType,
  ImageLocalPreviewUrlsReturnType,
} from "../../_common/ImageUploadFuntionality";
import { GetCommunitiesNameAPI } from "../api/CommunityApi";

const mdParser = new MarkdownIt();
interface EditorChange {
  html: string;
  text: string;
}

const BoardSubmit = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState<BoardType>("TEXT");
  const editorRef = useRef<any>(null);
  const [editorHeight, setEditorHeight] = useState(200);

  const ID: string = localStorage.getItem("id") as string;
  const NICKNAME: string = localStorage.getItem("nickname") as string;
  const [textTitle, setTextTitle] = useState<string>("");
  const handleTextTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setTextTitle(value);
  };

  const [mediaTitle, setMediaTitle] = useState<string>("");
  const handleMediaTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setMediaTitle(value);
  };

  const [linkTitle, setLinkTitle] = useState<string>("");
  const handleLinkTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setLinkTitle(value);
  };

  const [textContent, setTextContent] = useState<string>("");
  const handleEditorChange = (content: string) => {
    setTextContent(content);
  };

  const handleTextContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const textarea = event.target;
    setTextContent(textarea.value);

    // Adjust textarea height to fit content
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => console.log("textContent : ", textContent), [textContent]);

  const adjustEditorHeight = () => {
    if (editorRef.current) {
      const editorElement = editorRef.current.editor;
      if (editorElement) {
        const scrollHeight = editorElement.scrollHeight;
        const newHeight = Math.min(scrollHeight, 700);
        setEditorHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    adjustEditorHeight();
  }, [textContent]);

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event,
    });
    if (!urls) return;
    setPreviewUrls(urls.previewUrls);
    setFileList(urls.fileList);
  };

  const imageUrlListDelete = async () => {
    const res: ImageLocalPreviewUrlsDeleteType =
      await ImageLocalPreviewUrlsDelete({ urls: previewUrls });
    if (!res) return;
    setPreviewUrls(res);
  };

  const [linkContent, setLinkContent] = useState<string>("");
  const handleLinkContentChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setLinkContent(value);
  };

  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("jaych");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleCommunitySearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value) {
      try {
        const res = await GetCommunitiesNameAPI({ name: value });
        if (res && res.data && res.data.response) {
          console.log("Search results:", res.data.response);
          setSearchResults(
            res.data.response.map((community: any) => community.name),
          );
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleCommunitySelect = (community: string) => {
    setSelectedCommunity(community);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleCommunityChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setSelectedCommunity(value);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();

    let content: string[] = [];
    let title = "";

    try {
      if (inputType === "TEXT") {
        title = textTitle;
        content = [textContent];
      }

      if (inputType === "MEDIA") {
        const res: AwsImageUploadFunctionalityReturnType =
          await AwsImageUploadFunctionality({ fileList });
        if (!res) return;

        content = res.imageUrls;
        title = mediaTitle;
      }

      if (inputType === "LINK") {
        title = linkTitle;
        content = [linkContent];
      }

      const paramObj: SubmitParams = {
        identifierId: ID,
        content: content,
        title: title,
        category: selectedCommunity,
        nickname: NICKNAME,
        type: inputType,
      };

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
    marginTop: "10px",
    paddingTop: "10px",
    paddingBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "50px",
    maxHeight: "700px",
    overflowY: "auto" as "auto",
    resize: "none",
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

  useEffect(() => {
    const fetchDefaultCommunities = async () => {
      if (searchTerm) {
        try {
          const res = await GetCommunitiesNameAPI({ name: searchTerm });
          if (res && res.data && res.data.response) {
            setSearchResults(
              res.data.response.map((community: any) => community.name),
            );
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching communities:", error);
          setSearchResults([]);
        }
      }
    };

    fetchDefaultCommunities();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div style={{ flex: 2 }}>
          <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div style={{ flex: 2 }}>
                <div
                  style={{
                    width: "100%",
                    height: "auto",
                    padding: "10px",
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

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleCommunitySearchChange}
                    placeholder="커뮤니티 검색"
                    style={inputStyle}
                    disabled={!!selectedCommunity} // Disable input if a community is selected
                  />
                  {searchResults.length > 0 && (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          onClick={() => handleCommunitySelect(result)}
                          style={{
                            cursor: "pointer",
                            padding: "8px",
                            backgroundColor:
                              index % 2 === 0 ? "#f9f9f9" : "#fff",
                          }}
                        >
                          {result}
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchResults.length === 0 && searchTerm && (
                    <div>No communities found.</div>
                  )}
                  {selectedCommunity && (
                    <div>선택된 커뮤니티: {selectedCommunity}</div>
                  )}

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
                        ref={editorRef}
                        style={{ height: editorHeight }}
                        renderHTML={(text) => mdParser.render(text)}
                        // onChange={handleEditorChange}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardSubmit;
