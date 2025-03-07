import { Suspense, lazy } from 'react';
import './App.css';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CommunityProvider } from './contexts/CommunityContext';
import BoardList from './pages/Board/BoardRead/BoardList';
import Layout from './components/Layout';
import CustomSuspense from './components/Suspense';
import { AnimatePresence } from 'framer-motion';

const Chat = lazy(() => import('./pages/Chat/Chat'));
const BoardSubmit = lazy(() => import('./pages/Board/BoardSubmit/BoardSubmit'));
const BoardRead = lazy(() => import('./pages/Board/BoardRead/BoardRead'));
const Profile = lazy(() => import('./pages/User/Profile/Profile'));
const UsersInquiry = lazy(() => import('./pages/User/UsersInquiry'));
const SearchList = lazy(() => import('./pages/Search/SearchList'));
const CommunityCreatePage1 = lazy(() => import('./pages/Board/Community/CommunityCreatePage1'),);
const CommunityCreatePage2 = lazy(() => import('./pages/Board/Community/CommunityCreatePage2'),);
const CommunityCreatePage3 = lazy(() => import('./pages/Board/Community/CommunityCreatePage3'),);
const AdminList = lazy(() => import('./pages/Admin/AdminList'));
const SearchMobile = lazy(() => import('./pages/Search/SearchMobile'));
const MobilePrivacyPolicyPage = lazy(() => import('./components/MobilePrivacyPolicyPage'),);
const ChatLayout = lazy(() => import('./pages/User/chat/ChatLayout'));
const LinkPreviewComponent = lazy(() => import('./components/LinkPreviewComponent'),);
const Guard = lazy(() => import('../src/_common/Guard'))
const CommunityRead = lazy(() => import('../src/pages/Board/Community/CommunityRead'))

function App() {
  return (
    <>
      <Suspense fallback={<CustomSuspense />}>
      <AnimatePresence>
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
                  <Guard>
                  <Layout>
                    <BoardSubmit />
                  </Layout>
                  </Guard>
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
                  <Guard>
                  <Layout>
                    <Profile />
                  </Layout>
                  </Guard>
                }
              />
              {/* 문의하기 게시판*/}
              <Route path="/users/inquiry" element={<UsersInquiry />} />

              {/* 커뮤니티 */}
              <Route
                path={'/j/:communityName'}
                element={
                  <Layout>
                    <CommunityRead/>
                  </Layout>
                }
              />

              {/* 커뮤니티 만들기*/}
              <Route
                path="/community/create1"
                element={
                  <Guard>
                  <Layout>
                    <CommunityCreatePage1 />
                  </Layout>
                  </Guard>
                }
              />

              <Route
                path="/community/create2"
                element={
                  <Guard>
                  <Layout>
                    <CommunityCreatePage2 />
                  </Layout>
                  </Guard>
                }
              />
              <Route
                path="/community/create3"
                element={
                  <Guard>
                  <Layout>
                    <CommunityCreatePage3 />
                  </Layout>
                  </Guard>
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

              <Route path={'/test'} element={<LinkPreviewComponent />} />
              <Route path={'/chat'} element={<Chat />} />
              <Route path={`/chatLayout`} element={<ChatLayout />} />
            </Routes>
          </CommunityProvider>
        </Router>
      </AnimatePresence>
      </Suspense>
    </>
  );
}

export default App;
