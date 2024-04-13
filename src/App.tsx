import React from "react";
import "./App.css";
import GlobalBar from "./pages/Global/GlobalBar";
import GlobalSideBar from "./pages/Global/GlobalSideBar";
import BoardList from "./pages/Board/BoardList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardSubmit from "./pages/Board/BoardSubmit";

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
          {/*<Route path="login" element={<BoardSubmit />} />*/}
          <Route path="/submit" element={<BoardSubmit />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
