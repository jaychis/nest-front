import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MainListTypes } from "../../_common/CollectionTypes";
import { AppDispatch } from "../../store/store";
import {
  sideButtonSlice,
  // allButton,
  // homeButton,
  // popularButton,
  sideButtonSliceActions,
} from "../../reducers/mainListTypeSlice";

const GlobalSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isSideHovered, setIsSideHovered] = useState<
    MainListTypes | "CREATE_COMMUNITY" | null
  >(null);
  // const [isSideHovered, setIsSideHovered] = useState<MainListTypes | null>(null);
  // CREATE_COMMUNITY 만들고 나중에 다시 변경
  const [selectedButton, setSelectedButton] = useState<MainListTypes>("HOME");

  const handleClick = (button: MainListTypes) => {
    setSelectedButton(button);

    if (button === "HOME") dispatch(sideButtonSliceActions.homeButton());
    if (button === "POPULAR") dispatch(sideButtonSliceActions.popularButton());
    if (button === "ALL") dispatch(sideButtonSliceActions.allButton());
    if (button === "경제") dispatch(sideButtonSliceActions.economicsButton());
    if (button === "프로그래밍")
      dispatch(sideButtonSliceActions.programmingButton());
    if (button === "예술") dispatch(sideButtonSliceActions.artButton());
    if (button === "수학") dispatch(sideButtonSliceActions.mathematicsButton());
    if (button === "독서") dispatch(sideButtonSliceActions.readingButton());

    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "25vh", // 너비를 25vh로 조정
        height: "100vh", // 전체 화면 높이로 변경
        background: "#fff",
        marginRight: "20px",
        border: "2px solid #D3D3D3",
        borderTop: "none", // 홈 위에 상단 보더라인 삭제
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor:
            selectedButton === "HOME" || isSideHovered === "HOME"
              ? "#f0f0f0"
              : "white",
          borderRadius: "5px",
          margin: "5px",
        }}
        onMouseEnter={() => setIsSideHovered("HOME")}
        onMouseLeave={() => setIsSideHovered(null)}
      >
        <span
          onClick={() => handleClick("HOME")}
          style={{ fontSize: "24px", cursor: "pointer" }}
        >
          🏠
        </span>
        <span
          onClick={() => handleClick("HOME")}
          style={{ marginLeft: "8px", cursor: "pointer", fontSize: "24px" }}
        >
          홈
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor:
            selectedButton === "POPULAR" || isSideHovered === "POPULAR"
              ? "#f0f0f0"
              : "white",
          borderRadius: "5px",
          margin: "5px",
        }}
        onMouseEnter={() => setIsSideHovered("POPULAR")}
        onMouseLeave={() => setIsSideHovered(null)}
      >
        <span
          onClick={() => handleClick("POPULAR")}
          style={{ fontSize: "24px", cursor: "pointer" }}
        >
          🔥
        </span>
        <span
          onClick={() => handleClick("POPULAR")}
          style={{ marginLeft: "8px", cursor: "pointer", fontSize: "24px" }}
        >
          실시간
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor:
            selectedButton === "ALL" || isSideHovered === "ALL"
              ? "#f0f0f0"
              : "white",
          borderRadius: "5px",
          margin: "5px",
        }}
        onMouseEnter={() => setIsSideHovered("ALL")}
        onMouseLeave={() => setIsSideHovered(null)}
      >
        <span
          onClick={() => handleClick("ALL")}
          style={{ fontSize: "24px", cursor: "pointer" }}
        >
          🌐
        </span>
        <span
          onClick={() => handleClick("ALL")}
          style={{ marginLeft: "8px", cursor: "pointer", fontSize: "24px" }}
        >
          게시글
        </span>
      </div>
      {/* <div style={{ borderBottom: "1px solid #ccc", margin: "20px 0" }}></div> */}
      <div style={{ fontWeight: "bold", paddingLeft: "10px" }}>RECENT</div>
      <div style={{ padding: "10px 0 20px 10px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span style={{ fontSize: "24px" }}>🇰🇷</span>
          <span style={{ marginLeft: "8px" }}>r/korea</span>
        </div>
      </div>
      <div style={{ fontWeight: "bold", paddingLeft: "10px" }}>커뮤니티</div>
      <div style={{ padding: "10px 0 20px 10px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => handleClick("경제")}
          >
            📢
          </span>
          <span
            style={{ marginLeft: "8px", cursor: "pointer" }}
            onClick={() => handleClick("경제")}
          >
            j/경제
          </span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => handleClick("프로그래밍")}
          >
            🎮
          </span>
          <span
            style={{ marginLeft: "8px", cursor: "pointer" }}
            onClick={() => handleClick("프로그래밍")}
          >
            j/프로그래밍
          </span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => handleClick("예술")}
          >
            🎥
          </span>
          <span
            style={{ marginLeft: "8px", cursor: "pointer" }}
            onClick={() => handleClick("예술")}
          >
            j/예술
          </span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => handleClick("수학")}
          >
            📚
          </span>
          <span
            style={{ marginLeft: "8px", cursor: "pointer" }}
            onClick={() => handleClick("수학")}
          >
            j/수학
          </span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span
            style={{ fontSize: "24px, cursor: 'pointer'" }}
            onClick={() => handleClick("독서")}
          >
            🎨
          </span>
          <span
            style={{ marginLeft: "8px", cursor: "pointer" }}
            onClick={() => handleClick("독서")}
          >
            j/독서
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor:
            isSideHovered === "CREATE_COMMUNITY" ? "#f0f0f0" : "white",
          borderRadius: "5px",
          margin: "5px",
        }}
        onMouseEnter={() => setIsSideHovered("CREATE_COMMUNITY")}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => alert("Create a community")}
      >
        <span style={{ fontSize: "24px", marginRight: "8px" }}>➕</span>
        <span style={{ fontSize: "17px", cursor: "pointer" }}>
          커뮤니티 만들기
        </span>
      </div>
    </div>
  );
};

export default GlobalSideBar;
