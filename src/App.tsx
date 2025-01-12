import React, { Suspense, lazy } from 'react';
import './App.css';
import GlobalBar from './pages/Global/GlobalBar';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CommunityProvider } from './contexts/CommunityContext';
import styled,{keyframes} from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { breakpoints } from './_common/breakpoint';

const GlobalSideBar = lazy(() => import('./pages/Global/GlobalSideBar'));
const RightSideBar = lazy(() => import('./pages/Global/RightSideBar'));
const BoardList = lazy(() => import('./pages/Board/BoardList'));
const BoardSubmit = lazy(() => import('./pages/Board/BoardSubmit/BoardSubmit'));
const BoardRead = lazy(() => import('./pages/Board/BoardRead'));
const Profile = lazy(() => import('./pages/User/Profile'));
const UsersInquiry = lazy(() => import('./pages/User/UsersInquiry'));
const SearchList = lazy(() => import('./pages/Search/SearchList'));
const CommunityCreatePage1 = lazy(
  () => import('./pages/Board/CommunityCreate/CommunityCreatePage1'),
);
const CommunityCreatePage2 = lazy(
  () => import('./pages/Board/CommunityCreate/CommunityCreatePage2'),
);
const CommunityCreatePage3 = lazy(
  () => import('./pages/Board/CommunityCreate/CommunityCreatePage3'),
);
const AdminList = lazy(() => import('./pages/Admin/AdminList'));
const SearchMobile = lazy(() => import('./pages/Search/SearchMobile'));
const MobilePrivacyPolicyPage = lazy(
  () => import('./components/MobilePrivacyPolicyPage'),
);


const Layout = ({ children }: { readonly children: React.ReactNode }) => {
  const { hamburgerState } = useSelector(
    (state: RootState) => state.sideBarButton,
  );
  const LayoutContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
  `;

  const slideIn = keyframes`
        from {
            transform: translateX(-200px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    `;

  const slideOut = keyframes`
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-200px);
            opacity: 0;
        }
    `;

  const GlobalSideBarContainer = styled.div<{ readonly isOpen: boolean }>`
    width: 200px;
    height: 100%;
    position: fixed;

    @media (max-width: ${breakpoints.mobile}) {
      left: ${(props) => (props.isOpen ? '0' : '-200px')};
      z-index: 50;
      overflow: visible;
      animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.25s forwards;

      // visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
      opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
      transition:
        opacity 0.5s,
        visibility 0.5s;
    }
  `;

  const MainContent = styled.div`
    flex: 1;
    margin: 80px 0 0 200px;
    padding-top: 10px;
    overflow: auto;

    @media (max-width: ${breakpoints.mobile}) {
      margin: 80px 0 0 0;
      max-width: 100%;
    }
  `;

  return (
    <>
      <GlobalBar />
      <LayoutContainer>
        <GlobalSideBarContainer isOpen={hamburgerState}>
          <GlobalSideBar />
        </GlobalSideBarContainer>
        <MainContent>{children}</MainContent>
        <RightSideBar />
      </LayoutContainer>
    </>
  );
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
            {/*서치*/}
            <Route
              path={'/search/list'}
              element={
                <Layout>
                  <SearchList />
                </Layout>
              }
            />
            {/*어드민*/}
            <Route path={'/admin/list'} element={<AdminList />} />

            {/* 모바일 검색화면*/}
            <Route path={'/Searchmobile'} element={<SearchMobile />} />

            <Route
              path={'/privacy-policy/mobile'}
              element={<MobilePrivacyPolicyPage />}
            />
          </Routes>
        </CommunityProvider>
      </Router>
    </>
  );
}

export default App;
