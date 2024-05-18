import React, { useState } from "react";
import { FaPlus, FaSistrix, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import UserModalForm from "../User/UserModalForm";

const BoardBar = () => {
  const navigate = useNavigate();
  const postSubmit = () => navigate("/boards/submit");
  const [postHover, setPostHover] = useState<boolean>(false);
  const [userHover, setUserHover] = useState<boolean>(false);

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
        src={logo}
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
          placeholder="Search"
          style={{ width: "35%", padding: "10px", borderRadius: "20px" }}
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
        {localStorage.getItem("access_token") ? (
          <>
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
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={postSubmit}
            >
              <FaPlus style={{ marginRight: "5px" }} />
              <span>Create</span>
            </button>
          </>
        ) : (
          <>
            <UserModalForm />
          </>
        )}
      </div>
    </nav>
  );
};

export default BoardBar;
