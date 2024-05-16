import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GlobalSideBar = () => {
  const navigate = useNavigate();

  const [isHomeHovered, setIseHomeHovered] = useState<boolean>(false);
  const [isPopularHovered, setIsPopularHovered] = useState<boolean>(false);
  const [isAllHovered, setIsAllHovered] = useState<boolean>(false);

  const goHome = () => navigate("/");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "40vh",
        height: "100vh",
        background: "#fff",
        marginRight: "20px",
        border: "2px solid #D3D3D3",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor: isHomeHovered ? "#f0f0f0" : "white",
          borderRadius: "5px",
          margin: "5px",
        }}
        onMouseEnter={() => setIseHomeHovered(true)}
        onMouseLeave={() => setIseHomeHovered(false)}
      >
        {/* Icon placeholders, replace with actual icons */}
        <span onClick={goHome} style={{ fontSize: "24px", cursor: "pointer" }}>
          🏠
        </span>
        <span
          onClick={goHome}
          style={{ marginLeft: "8px", cursor: "pointer", fontSize: "24px" }}
        >
          Home
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor: isPopularHovered ? "#f0f0f0" : "white",
          borderRadius: "5px",
          margin: "5px",
        }}
        onMouseEnter={() => setIsPopularHovered(true)}
        onMouseLeave={() => setIsPopularHovered(false)}
      >
        <span style={{ fontSize: "24px", cursor: "pointer" }}>🔥</span>
        <span
          style={{ marginLeft: "8px", cursor: "pointer", fontSize: "24px" }}
        >
          Popular
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
          backgroundColor: isAllHovered ? "#f0f0f0" : "white",
          borderRadius: "5px",
          margin: "5px",
        }}
        onMouseEnter={() => setIsAllHovered(true)}
        onMouseLeave={() => setIsAllHovered(false)}
      >
        <span style={{ fontSize: "24px", cursor: "pointer" }}>🌐</span>
        <span
          style={{ marginLeft: "8px", cursor: "pointer", fontSize: "24px" }}
        >
          All
        </span>
      </div>
      <div style={{ borderBottom: "1px solid #ccc", margin: "20px 0" }}></div>
      <div style={{ fontWeight: "bold", paddingLeft: "10px" }}>RECENT</div>
      <div style={{ padding: "10px 0 20px 10px" }}>
        {/* Repeat for each item, replace emojis with actual icons */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span style={{ fontSize: "24px" }}>🇰🇷</span>
          <span style={{ marginLeft: "8px" }}>r/korea</span>
        </div>
        {/* ... other recent items */}
      </div>
      <div style={{ fontWeight: "bold", paddingLeft: "10px" }}>COMMUNITIES</div>
      <div style={{ padding: "10px 0 20px 10px" }}>
        {/* Repeat for each item, replace emojis with actual icons */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <span style={{ fontSize: "24px" }}>📢</span>
          <span style={{ marginLeft: "8px" }}>r/announcements</span>
        </div>
        {/* ... other community items */}
      </div>
    </div>
  );
};

export default GlobalSideBar;
