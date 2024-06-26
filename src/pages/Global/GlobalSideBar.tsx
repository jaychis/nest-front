import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MainListTypes } from "../../_common/CollectionTypes";
import { AppDispatch } from "../../store/store";
import { sideButtonSliceActions } from "../../reducers/mainListTypeSlice";

import logo from "../../assets/img/panda_logo.png";
import { CommunityListAPI } from "../api/CommunityApi";

const GlobalSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isSideHovered, setIsSideHovered] = useState<MainListTypes | "CREATE_COMMUNITY" | null>(null);
  const [selectedButton, setSelectedButton] = useState<MainListTypes>("HOME");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("access_token");

  type CommunityType = {
    readonly name: string;
    readonly description: string;
    readonly banner: string | null;
    readonly icon: string | null;
  };

  const [communityList, setCommunityList] = useState<CommunityType[]>([]);
  const [communityNamesSet, setCommunityNamesSet] = useState<Set<string>>(new Set());
  const [displayCount, setDisplayCount] = useState(5);

  const fetchCommunities = async (page: number) => {
    setLoading(true);
    try {
      const res = await CommunityListAPI({ take: 10, page });
      if (!res) return;
      const response = res.data.response.current_list;

      const uniqueCommunities = response.filter((community: CommunityType) => {
        if (communityNamesSet.has(community.name)) {
          return false;
        } else {
          communityNamesSet.add(community.name);
          return true;
        }
      });

      setCommunityList((prevList) => [...prevList, ...uniqueCommunities]);
    } catch (err) {
      console.log("CommunityListAPI error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities(page);
  }, [page]);

  useEffect(() => {
    const initialSet = new Set(communityList.map((community) => community.name));
    setCommunityNamesSet(initialSet);
  }, [communityList]);

  const handleClick = (button: MainListTypes) => {
    setSelectedButton(button);
    dispatch(sideButtonSliceActions.setButtonType(button));
  };

  const handleCommunityClick = (button: string) => {
    dispatch(sideButtonSliceActions.setButtonType(button));
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  const handleCreateCommunityClick = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    navigate("/community/create1");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "200px",
        height: "100%",
        background: "#fff",
        marginRight: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ddd",
        borderTop: "none",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "6px 0",
          backgroundColor: selectedButton === "HOME" || isSideHovered === "HOME" ? "#f0f0f0" : "white",
          borderRadius: "5px",
          margin: "1px",
        }}
        onMouseEnter={() => setIsSideHovered("HOME")}
        onMouseLeave={() => setIsSideHovered(null)}
      >
        <span onClick={() => handleClick("HOME")} style={{ fontSize: "16px", cursor: "pointer" }}>
          🏠
        </span>
        <span onClick={() => handleClick("HOME")} style={{ marginLeft: "6px", cursor: "pointer", fontSize: "16px" }}>
          홈
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "6px 0",
          backgroundColor: selectedButton === "POPULAR" || isSideHovered === "POPULAR" ? "#f0f0f0" : "white",
          borderRadius: "5px",
          margin: "1px",
        }}
        onMouseEnter={() => setIsSideHovered("POPULAR")}
        onMouseLeave={() => setIsSideHovered(null)}
      >
        <span onClick={() => handleClick("POPULAR")} style={{ fontSize: "16px", cursor: "pointer" }}>
          🔥
        </span>
        <span onClick={() => handleClick("POPULAR")} style={{ marginLeft: "6px", cursor: "pointer", fontSize: "16px" }}>
          실시간
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "6px 0",
          backgroundColor: selectedButton === "ALL" || isSideHovered === "ALL" ? "#f0f0f0" : "white",
          borderRadius: "5px",
          margin: "1px",
        }}
        onMouseEnter={() => setIsSideHovered("ALL")}
        onMouseLeave={() => setIsSideHovered(null)}
      >
        <span onClick={() => handleClick("ALL")} style={{ fontSize: "16px", cursor: "pointer" }}>
          🌐
        </span>
        <span onClick={() => handleClick("ALL")} style={{ marginLeft: "6px", cursor: "pointer", fontSize: "16px" }}>
          게시글
        </span>
      </div>
      <div style={{ fontWeight: "bold", paddingLeft: "10px", fontSize: "14px" }}>RECENT</div>
      <div style={{ padding: "5px 0 10px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "20px" }}>
            🇰🇷
          </span>
          <span style={{ marginLeft: "6px", fontSize: "14px" }}>
            r/korea
          </span>
        </div>
      </div>
      <div style={{ fontWeight: "bold", paddingLeft: "10px", fontSize: "14px" }}>커뮤니티</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 0",
          backgroundColor: isSideHovered === "CREATE_COMMUNITY" ? "#f0f0f0" : "white",
          borderRadius: "10px",
          margin: "5px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsSideHovered("CREATE_COMMUNITY")}
        onMouseLeave={() => setIsSideHovered(null)}
        onClick={handleCreateCommunityClick}
      >
        <span style={{ fontSize: "14px", marginRight: "10px" }}>
          ➕
        </span>
        <span style={{ fontSize: "14px" }}>
          커뮤니티 만들기
        </span>
      </div>
      <div style={{ flex: 1, padding: "5px 0 10px 10px", overflowY: "auto" }}>
        {communityList.length > 0
          ? communityList.slice(0, displayCount).map((community: CommunityType, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <img
                  src={logo}
                  alt={"community icon"}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCommunityClick(community.name)}
                />
                <span style={{ marginLeft: "6px", cursor: "pointer", fontSize: "14px" }} onClick={() => handleCommunityClick(community.name)}>
                  j/{community.name}
                </span>
              </div>
            ))
          : []}
      </div>
      {communityList.length > displayCount && (
        <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            style={{
              padding: "8px 16px",
              borderRadius: "5px",
              backgroundColor: "#0079D3",
              color: "white",
              border: "none",
              cursor: "pointer",
              visibility: loading ? 'hidden' : 'visible',
            }}
          >
            {loading ? "로딩 중..." : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalSideBar;