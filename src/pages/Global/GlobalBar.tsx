import React, { useRef, useState } from "react";
import { FaSistrix, FaPlus, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserModalForm from "../User/UserModalForm";
import logo from "../../assets/img/panda_logo.png";
import ProfileModal from "../User/ProfileModal";
import { AddSearchAPI } from "../api/SearchApi.tex";
import NotificationModal from "../User/NotificationModal";
import { searchQuery } from "../../reducers/searchSlice";
import { RootState, AppDispatch } from "../../store/store";

const GlobalBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults,
  );
  const postSubmit = () => navigate("/boards/submit");
  const [postHover, setPostHover] = useState<boolean>(false);
  const [userHover, setUserHover] = useState<boolean>(false);
  const [bellHover, setBellHover] = useState<boolean>(false);
  const [logoHover, setLogoHover] = useState<boolean>(false); // 추가
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState<boolean>(false);
  const userButtonRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLDivElement>(null);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const [query, setQuery] = useState<string>("");
  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const value = event.target.value;

    setQuery(value);
    setSearchTerm(value);
    if (value.length > 2) {
      dispatch(searchQuery(value));
    }
  };
  const addSearch = async () => {
    await AddSearchAPI({ query });
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
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
      {/* Logo and Site Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: logoHover ? "#D3D3D3" : "transparent",
          borderRadius: "25px", // 추가
          padding: "10px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setLogoHover(true)}
        onMouseLeave={() => setLogoHover(false)}
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: "50px" }}
        />
        <span style={{ marginLeft: "10px" }}>
          {"jaych.com"}
        </span>
      </div>

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
          value={searchTerm}
          style={{ width: "35%", padding: "10px", borderRadius: "20px" }}
          name={"search"}
          onChange={(e) => handleSearchChange(e)}
        />
        <FaSistrix
          style={{
            marginRight: "20px",
            width: "30px",
            height: "30px",
            marginTop: "5px",
          }}
          onClick={addSearch}
        />
        {/* Search Icon */}
        {searchTerm.length > 2 && (
          <div style={styles.searchResults as React.CSSProperties}>
            {searchResults.map((result, index) => (
              <div key={index} style={styles.searchResultItem as React.CSSProperties}>
                {result}
              </div>
            ))}
          </div>
        )}
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
                background: userHover ? "#D3D3D3" : "transparent",
                cursor: "pointer",
                position: "relative", // 추가
              }}
              onMouseEnter={() => setUserHover(true)}
              onMouseLeave={() => setUserHover(false)}
              onClick={toggleProfileModal}
            >
              <div
                style={{
                  position: "absolute", // 추가
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: userHover ? "#D3D3D3" : "transparent",
                  zIndex: 1,
                }}
              ></div>
              <img
                src={logo}
                alt="Profile"
                style={{ width: "40px", height: "40px", borderRadius: "50%", zIndex: 2 }}
              />
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
                background: postHover ? "#f0f0f0" : "white",
                border: "none",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "10px 20px",
                fontSize: "16px",
                marginRight: "10px",
                borderRadius: "25px",
              }}
              onClick={postSubmit}
            >
              <FaPlus style={{ marginRight: "5px" }} />
              <span>글쓰기</span>
            </button>
            {/* Plus/Create Icon */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                background: bellHover ? "#D3D3D3" : "transparent",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onMouseEnter={() => setBellHover(true)}
              onMouseLeave={() => setBellHover(false)}
              onClick={toggleNotificationModal}
            >
              <FaBell
                style={{
                  color: bellHover ? "white" : "black",
                  width: "20px",
                  height: "20px",
                }}
              />
            </div>
            <NotificationModal
              isOpen={isNotificationModalOpen}
              onRequestClose={toggleNotificationModal}
              buttonRef={bellButtonRef}
            />
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

const styles = {
  searchResults: {
    position: "absolute" as "absolute",
    top: "60px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "35%",
    maxHeight: "200px",
    overflowY: "auto" as "auto",
    zIndex: 1000,
  },
  searchResultItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
};

export default GlobalBar;
