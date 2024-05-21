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

const Layout = () => {
  return (
    <>
      <GlobalBar />
      <RightSideBar />
      <div style={{ display: "flex" }}>
        <GlobalSideBar />
        <BoardList />
      </div>
    </>
  );
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />} />

          {/*게시판*/}
          <Route path="/boards/submit" element={<BoardSubmit />} />
          <Route path="/boards/read" element={<BoardRead />} />

          {/*유저*/}
          <Route path="/users/profile" element={<Profile />} />
          <Route path={"/users/inquiry"} element={<UsersInquiry />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
