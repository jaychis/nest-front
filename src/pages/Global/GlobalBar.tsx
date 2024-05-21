import React, { useRef, useState } from "react";
import { FaSistrix, FaUserAlt, FaPlus, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserModalForm from "../User/UserModalForm";
import logo from "../../assets/img/panda_logo.png";
import ProfileModal from "../User/ProfileModal";

const GlobalBar = () => {
  const navigate = useNavigate();
  const postSubmit = () => navigate("/boards/submit");
  const [postHover, setPostHover] = useState<boolean>(false);
  const [userHover, setUserHover] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const userButtonRef = useRef<HTMLDivElement>(null);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

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
        style={{ width: "50px", cursor: "pointer" }}
        onClick={() => navigate("/")}
      />
      <span>{"jaych.com"}</span>

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
            <div
              ref={userButtonRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                background: userHover ? "#007BFF" : "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={() => setUserHover(true)}
              onMouseLeave={() => setUserHover(false)}
              onClick={toggleProfileModal}
            >
              <FaUserAlt style={{ color: userHover ? "white" : "black" }} />
            </div>
            <ProfileModal
              isOpen={isProfileModalOpen}
              onRequestClose={toggleProfileModal}
              buttonRef={userButtonRef}

            />
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
            {/* Plus/Create Icon */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                background: "transparent",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              <FaBell style={{ color: "black" }} />
            </div>
            {/* Notification Icon */}
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

export default GlobalBar;