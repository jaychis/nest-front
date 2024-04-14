import React, { useState } from "react";
import { FaSistrix, FaUserAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GlobalBar = () => {
  const [postHover, setPostHover] = useState<boolean>(false);
  const [userHover, setUserHover] = useState<boolean>(false);
  const navigate = useNavigate();
  const postSubmit = () => navigate("/submit");

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: "10px",
        border: "2px solid #D3D3D3",
      }}
    >
      {/* Logo */}
      <img src="logo.png" alt="Logo" style={{ width: "50px" }} />

      {/* Search Bar */}
      <div
        style={{
          flexGrow: 1,
          marginLeft: "20px",
          marginRight: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          type="search"
          placeholder="Search Reddit"
          style={{ width: "35%", padding: "10px" }}
        />
        <FaSistrix
          style={{
            marginRight: "20px",
            width: "30px",
            height: "30px",
            marginTop: "5px",
          }}
        />
        {/* Search Icon */}
      </div>

      {/* Navigation Icons */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{
            background: userHover ? "#4F657755" : "white",
            border: "none",
          }}
          onMouseEnter={() => setUserHover(true)}
          onMouseLeave={() => setUserHover(false)}
        >
          <FaUserAlt style={{ marginRight: "20px" }} /> {/* User Icon */}
        </button>
        <button
          onMouseEnter={() => setPostHover(true)}
          onMouseLeave={() => setPostHover(false)}
          style={{
            background: postHover ? "#4F657755" : "white",
            border: "none",
          }}
        >
          <FaPlus onClick={postSubmit} />
          {/* Plus/Create Icon */}
        </button>
      </div>
    </nav>
  );
};
export default GlobalBar;
