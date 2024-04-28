import React from "react";
import { FaPlus, FaSistrix, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BoardBar = () => {
  const navigate = useNavigate();
  const postSubmit = () => navigate("/boards/submit");

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
      <img
        src="logo.png"
        alt="Logo"
        style={{ width: "50px" }}
        onClick={() => navigate("/")}
      />

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
        <FaUserAlt style={{ marginRight: "20px" }} /> {/* User Icon */}
        <button style={{ background: "none", border: "none" }}>
          <FaPlus onClick={postSubmit} /> {/* Plus/Create Icon */}
        </button>
      </div>
    </nav>
  );
};

export default BoardBar;
