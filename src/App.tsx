import { Suspense, lazy } from 'react';
import './App.css';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CommunityProvider } from './contexts/CommunityContext';
import BoardList from './pages/Board/BoardRead/BoardList';
import Layout from './components/Layout';
import CustomSuspense from './components/Suspense';
import Chat from './pages/Chat/Chat';

const BoardSubmit = lazy(() => import('./pages/Board/BoardSubmit/BoardSubmit'));
const BoardRead = lazy(() => import('./pages/Board/BoardRead/BoardRead'));
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
const ChatLayout = lazy(() => import('./pages/User/chat/ChatLayout'));
const LinkPreviewComponent = lazy(
  () => import('./components/LinkPreviewComponent'),
);

function App() {
  return (
    <>
      <Suspense fallback={<CustomSuspense />}>
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
                path="/users/profile/:userId"
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

              <Route path={`/chatLayout`} element={<ChatLayout />} />

              <Route path={'/test'} element={<LinkPreviewComponent />} />
              <Route path={'/chat'} element={<Chat />} />
            </Routes>
          </CommunityProvider>
        </Router>
      </Suspense>
    </>
  );
}

export default App;
