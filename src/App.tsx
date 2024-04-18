import React from "react";
import "./App.css";
import GlobalBar from "./pages/Global/GlobalBar";
import GlobalSideBar from "./pages/Global/GlobalSideBar";
import BoardList from "./pages/Board/BoardList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardSubmit from "./pages/Board/BoardSubmit";
import BoardRead from "./pages/Board/BoardRead";
import Profile from "./pages/User/Profile";

const Layout = () => {
  return (
    <>
      <GlobalBar />
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
        <Routes>
          <Route path="/" element={<Layout />} />

          {/*게시판*/}
          <Route path="/submit" element={<BoardSubmit />} />
          <Route path="/read" element={<BoardRead />} />

          {/*유저*/}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
