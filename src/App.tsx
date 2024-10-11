import React from 'react';
import './App.css';
import GlobalBar from './pages/Global/GlobalBar';
import GlobalSideBar from './pages/Global/GlobalSideBar';
import BoardList from './pages/Board/BoardList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BoardSubmit from './pages/Board/BoardSubmit';
import BoardRead from './pages/Board/BoardRead';
import Profile from './pages/User/Profile';
import UsersInquiry from './pages/User/UsersInquiry';
import ScrollToTop from './components/ScrollToTop';
import RightSideBar from './pages/Global/RightSideBar';
import SearchList from './pages/Search/SearchList';
import CommunityCreatePage1 from './pages/Board/CommunityCreate/CommunityCreatePage1';
import CommunityCreatePage3 from './pages/Board/CommunityCreate/CommunityCreatePage3';
import CommunityCreatePage4 from './pages/Board/CommunityCreate/CommunityCreatePage4';
import { CommunityProvider } from './contexts/CommunityContext';

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
    display: 'flex',
    width: '100%',
    height: '100vh',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    marginLeft: '11%',
    marginTop: '80px',
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
            {/* 문의하기 게시판*/}

            <Route path="/users/inquiry" element={<UsersInquiry />} />
            {/* 커뮤니티 만들기*/}
            <Route
              path="/community/create1"
              element={
                <Layout>
                  <CommunityCreatePage1 />
                </Layout>
              }
            />
            {/* <Route
              path="/community/create2"
              element={
                <Layout>
                  <CommunityCreatePage2 />
                </Layout>
              }
            /> */}
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
              path={'/search/list'}
              element={
                <Layout>
                  <SearchList />
                </Layout>
              }
            />
            {/* 새 라우터 */}
          </Routes>
        </CommunityProvider>
      </Router>
    </>
  );
}

export default App;
