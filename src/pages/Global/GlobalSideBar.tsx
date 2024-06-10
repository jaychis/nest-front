import React, { useEffect, useState } from "react";
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

import logo from "../../assets/img/panda_logo.png";
import {
  CommunityListAPI,
  CommunitySubmitAPI,
  CommunitySubmitParams,
} from "../api/CommunityApi";

const GlobalSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isSideHovered, setIsSideHovered] = useState<
    MainListTypes | "CREATE_COMMUNITY" | null
  >(null);
  // const [isSideHovered, setIsSideHovered] = useState<MainListTypes | null>(null);
  // CREATE_COMMUNITY 만들고 나중에 다시 변경
  const [selectedButton, setSelectedButton] = useState<MainListTypes>("HOME");

  type CommunityType = {
    readonly name: string;
    readonly description: string;
    readonly banner: string | null;
    readonly icon: string | null;
  };
  const [communityList, setCommunityList] = useState<CommunityType[]>([]);
  useEffect(() => {
    console.log("CommunityListAPI start");
    CommunityListAPI({ take: 10, page: 1 })
      .then((res) => {
        if (!res) return null;
        const response = res.data.response.current_list;

        console.log("response : ", response);
        setCommunityList(response);
      })
      .catch((err) => console.log("CommunityListAPI error : ", err));
  }, []);
  const handleClick = (button: MainListTypes) => {
    setSelectedButton(button);

    if (button === "HOME")
      dispatch(sideButtonSliceActions.setButtonType("HOME"));
    if (button === "POPULAR")
      dispatch(sideButtonSliceActions.setButtonType("POPULAR"));
    if (button === "ALL") dispatch(sideButtonSliceActions.setButtonType("ALL"));
  };
  const handleCommunityClick = (button: string) => {
    dispatch(sideButtonSliceActions.setButtonType(button));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "25vh", // 너비를 25vh로 조정
        // height: "100vh", // 전체 화면 높이로 변경
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
        {communityList.length > 0
          ? communityList.map((community: CommunityType) => {
              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <img
                      src={logo}
                      alt={"community icon"}
                      style={{
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCommunityClick(community.name)}
                    />
                    <span
                      style={{ marginLeft: "8px", cursor: "pointer" }}
                      onClick={() => handleCommunityClick(community.name)}
                    >
                      j/{community.name}
                    </span>
                  </div>
                </>
              );
            })
          : []}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor:
            isSideHovered === "CREATE_COMMUNITY" ? "#f0f0f0" : "white",
          borderRadius: "10px",
          margin: "5px",
        }}
        onMouseEnter={() => setIsSideHovered("CREATE_COMMUNITY")}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={() => navigate("/community/create1")} // 페이지로 이동하도록 수정
      >
        <span
          style={{ fontSize: "24px", marginRight: "8px", cursor: "pointer" }}
        >
          ➕
        </span>
        <span style={{ fontSize: "17px", cursor: "pointer" }}>
          커뮤니티 만들기
        </span>
      </div>
    </div>
  );
};

export default GlobalSideBar;
