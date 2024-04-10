import React from "react";
import "./App.css";
import GlobalBar from "./pages/Global/GlobalBar";
import GlobalSideBar from "./pages/Global/GlobalSideBar";
import BoardList from "./pages/Board/BoardList";

function App() {
  return (
    <>
      <GlobalBar />
      <div style={{ display: "flex" }}>
        <GlobalSideBar />
        <BoardList />
      </div>
    </>
  );
}

export default App;
