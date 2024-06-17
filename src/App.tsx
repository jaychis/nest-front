import React from "react";
import "./App.css";
import GlobalBar from "./pages/Global/GlobalBar";
import GlobalSideBar from "./pages/Global/GlobalSideBar";
import BoardList from "./pages/Board/BoardList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardSubmit from "./pages/Board/BoardSubmit";
import BoardRead from "./pages/Board/BoardRead";
import Profile from "./pages/User/Profile";
import UsersInquiry from "./pages/User/UsersInquiry";
import ScrollToTop from "./components/ScrollToTop";
import RightSideBar from "./pages/Global/RightSideBar";
import SearchList from "./pages/Search/SearchList";
import CommunityCreatePage1 from "./pages/Board/CommunityCreate/CommunityCreatePage1";
import CommunityCreatePage2 from "./pages/Board/CommunityCreate/CommunityCreatePage2";
import CommunityCreatePage3 from "./pages/Board/CommunityCreate/CommunityCreatePage3";
import CommunityCreatePage4 from "./pages/Board/CommunityCreate/CommunityCreatePage4";
import { CommunityProvider } from "./contexts/CommunityContext";
import KakaoLogin from "./pages/Kakao/KakaoLogin";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <GlobalBar />
      <div style={styles.layoutContainer}>
        <GlobalSideBar />
        <div style={styles.mainContent}>{children}</div>
        <RightSideBar />
      </div>
    </>
  );
};

const styles = {
  layoutContainer: {
    display: "flex",
    width: "100%",
    height: "calc(100vh - 70px)", // GlobalBar의 높이를 제외한 높이 설정
    overflow: "hidden", // 레이아웃 컨테이너 내부 스크롤 방지
  },
  mainContent: {
    flex: 1,
    overflowY: "auto" as "auto",
    padding: "20px",
  },
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <CommunityProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <BoardList />
                </Layout>
              }
            />
            {/*Kakao*/}
            <Route
              path={"/kakao/login"}
              element={
                <Layout>
                  <KakaoLogin />
                </Layout>
              }
            />
            {/*게시판*/}
            <Route
              path="/boards/submit"
              element={
                <Layout>
                  <BoardSubmit />
                </Layout>
              }
            />
            <Route
              path="/boards/read"
              element={
                <Layout>
                  <BoardRead />
                </Layout>
              }
            />
            {/*유저*/}
            <Route
              path="/users/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />

            <Route
              path="/users/inquiry"
              element={
                <Layout>
                  <UsersInquiry />
                </Layout>
              }
            />
            {/* 커뮤니티 만들기*/}
            <Route
              path="/community/create1"
              element={
                <Layout>
                  <CommunityCreatePage1 />
                </Layout>
              }
            />
            <Route
              path="/community/create2"
              element={
                <Layout>
                  <CommunityCreatePage2 />
                </Layout>
              }
            />
            <Route
              path="/community/create3"
              element={
                <Layout>
                  <CommunityCreatePage3 />
                </Layout>
              }
            />
            <Route
              path="/community/create4"
              element={
                <Layout>
                  <CommunityCreatePage4 />
                </Layout>
              }
            />
            {/*서치*/}
            <Route
              path={"/search/list"}
              element={
                <Layout>
                  <SearchList />
                </Layout>
              }
            />
            {/* 새 라우트 추가 */}
          </Routes>
        </CommunityProvider>
      </Router>
    </>
  );
}

export default App;
