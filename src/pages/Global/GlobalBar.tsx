import React, { useRef, useState, useEffect } from "react";
import { FaSistrix, FaPlus, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserModalForm from "../User/UserModalForm";
import logo from "../../assets/img/panda_logo.png";
import ProfileModal from "../User/ProfileModal";
import { AddSearchAPI } from "../api/SearchApi";
import NotificationModal from "../User/NotificationModal";
import { searchQuery } from "../../reducers/searchSlice";
import { RootState, AppDispatch } from "../../store/store";
import debounce from "lodash.debounce";
import modalStateReducer from "../../reducers/modalStateSlice";
import { UserModalState, setModalState} from "../../reducers/modalStateSlice";
import 'react-tooltip/dist/react-tooltip.css' 
import { Tooltip } from 'react-tooltip'
import './GlobalBar.module.css' ;


const GlobalBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults,
  );
  const postSubmit = () => navigate("/boards/submit");
  const [userHover, setUserHover] = useState<boolean>(false);
  const [bellHover, setBellHover] = useState<boolean>(false);
  const [logoHover, setLogoHover] = useState<boolean>(false);
  const [plusHover, setPlusHover] = useState<boolean>(false);
  const [inquiryHover, setInquiryHover] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const userButtonRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLDivElement>(null);

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const openModal = () => {
    dispatch(setModalState(!modalState.modalState));
  };

  const debouncedSearch = debounce((value: string) => {
    if (value.length > 2) {
      dispatch(searchQuery(value));
    }
  }, 300); // 300ms 디바운싱

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value); // Use debounced search
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      clickSearch();
    }
  };

  const clickSearch = async () => {
    if (!searchTerm) {
      // 나중에는 alert 제거하기
      alert("내용을 입력해주세요");
      return;
    }

    await AddSearchAPI({ query: searchTerm });
    navigate(`/search/list?query=${searchTerm}`);
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  const handleAddTopic = (topic: string) => {
    setSearchTerm(topic);
    navigate(`/search/list?query=${topic}`);
  };

  const handleLogoClick = () => {
    console.log("Logo clicked");
    navigate("/");
  };

  useEffect(() => {
    if (isProfileModalOpen === false && modalState.modalState === true) {
      openModal();
    }
  },[isProfileModalOpen])

  useEffect(() => {
    if(isNotificationModalOpen === false && modalState.modalState === true){
      openModal()
    }
  },[isNotificationModalOpen])
  
  return (
    <div>
      <nav
        style={{
          position: "fixed",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: "10px",
          border: "2px solid #D3D3D3",
          width: "100%",
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
          onClick={handleLogoClick}
        >
          <img src={logo} alt="Logo" style={{ width: "50px" }} />
          <span style={{ marginLeft: "10px" }}>{"jaychis.com"}</span>
        </div>

        {/* Search Bar */}
        <div
          style={{
            flexGrow: 1,
            marginLeft: "20px",
            marginRight: "20px",
            display: "flex",
            justifyContent: "center",
            position: "relative", // 검색 결과를 절대 위치로 표시하기 위해 필요
          }}
        >
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            style={{ width: "35%", padding: "10px", borderRadius: "20px" }}
            name={"search"}
            onChange={(e) => handleSearchChange(e)}
            onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
          />
          <FaSistrix
            style={{
              marginRight: "20px",
              width: "30px",
              height: "30px",
              marginTop: "5px",
              cursor: "pointer",
            }}
            onClick={clickSearch}
          />
          {/* Search Icon */}
          {searchTerm.length > 0 && searchResults.length > 0 && (
            <div style={styles.searchResults as React.CSSProperties}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  style={styles.searchResultItem as React.CSSProperties}
                  onClick={() => handleAddTopic(result)}
                >
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
                onClick = {openModal}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  zIndex: 2,
                }}
              />
            </div>
            <ProfileModal
              isOpen={isProfileModalOpen}
              onRequestClose={toggleProfileModal}
              buttonRef={userButtonRef}
            />
            <div 
                style = {{
                display: "flex",
                alignItems: "center",
                justifyContent : "center",
                cursor: "pointer",
                fontSize: "16px",
                borderRadius: "25px",
                marginLeft : '5px',
                background : plusHover ? '#D3D3D3' : 'white'
                }}
                onMouseEnter = {() => {setPlusHover(true)}}
                onMouseLeave = {() => {setPlusHover(false)}}
                >
            <button
              style={{
                border: "none",
                background : plusHover ? '#D3D3D3' : 'white'
              }}
              onClick={postSubmit}
              
            ><Tooltip
            id = 'tooltip'
            place="top"
            arrowColor='transparent'
            />
              <FaPlus 
              data-tooltip-content='글쓰기' 
              data-tooltip-id='tooltip'
              style={{
                width: "20px",
                height: "20px",
              }}
              />
            </button>
            </div>
            {/* Plus/Create Icon */}
            <div
              style = {{
                display: "flex",
                alignItems: "center",
                justifyContent : "center",
                cursor: "pointer",
                fontSize: "16px",
                borderRadius: "25px",
                background : inquiryHover ? '#D3D3D3' : 'white'
                }}
                onMouseEnter = {() => {setInquiryHover(true)}}
                onMouseLeave = {() => {setInquiryHover(false)}}
            >
              <button 
                onClick = {() => {navigate('/submit/inquiry')}}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent : "center",
                  border: "none",
                  fontSize: "16px",
                  borderRadius: "25px",
                  background : inquiryHover ? '#D3D3D3' : 'white'
                }}> 
              <Tooltip
                id = 'tooltip2'
                place="top"
                arrowColor='transparent'
              />
              <img 
                data-tooltip-content='문의하기' 
                data-tooltip-id='tooltip2'
                height = "55%" width = '55%' 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7klEQVR4nO3Yz4uNURzH8df4kfyakowsLGQU2diIiMjKhkiilJ3ZmRr/gFhYs5iFslMWSikLWSkZUjY2QpRQfqc0fvPoqe/iaRjm3rn3Pj867zrdOs/5fp9z7nnO5/v9HhKJRCJREllDmsYtpK5kjV3IoPox+LeFvMMW9WEDXk122L/ggOqzB+OTHfbR+P2JEdVlJOZYnPMfh324MOgsZqkOM3Em5vYLx/+nWnvxKfquYqHymY/Lhc//4FTldyNeR/8dLFUei3GzIEhbW40jK/Egnj3BGuXI68OYw2Osbjcg5v/GjXj+Htv0jk14E+++jYHpRvY5uBBjvuKQ7rMPn+OdlzCvUylKX6jERMXoBsMF5TyNGd3ItY7ge4w/h9k6K6+j4fsHjnY7adxdiKrX0G/6LMCV8Jl/Uvt7lf2ux8uwu4fl2mcZ7oavt9jc6zR+Be6H7Qusa8PHWjwNH4+wqqx6ZBGuh/1H7GzBdgc+hO0YlpRdWOXyfD585EIwNAWbw/gWNhcxtyoVYh9OFeT5RKjQRPK+kzEmC5vctnKl7lBBnvP8aFdE5IFQu7EWd67Umn07nv/jtuNZjKnF5UM/jkWONB7tVhRFnS4LssbeotSVLC2kYmRpRypGlnakYmSN3ZGs5k1jFpJIJBIJveY3S2K8l4EjqFIAAAAASUVORK5CYII="></img> </button>
            </div>
            
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
              onClick = {() => {toggleNotificationModal(); openModal()}}
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
    </div>
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
