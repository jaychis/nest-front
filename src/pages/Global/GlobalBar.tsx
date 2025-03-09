import React, { useRef, useState, useEffect,lazy } from 'react';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { FaBell } from '@react-icons/all-files/fa/FaBell';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { AddSearchAPI } from '../api/searchApi';
import { setSearchResults } from '../../reducers/searchSlice';
import { AppDispatch } from '../../store/store';
import debounce from 'lodash.debounce';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import { sideButtonSliceActions } from '../../reducers/mainListTypeSlice';
import { breakpoints } from '../../_common/breakpoint';

const UserModalForm = lazy(() => import('../User/UserModalForm'));
const ProfileModal = lazy(() => import('../User/ProfileModal'));
const NotificationModal = lazy(() => import('../User/NotificationModal'));
type hoverType = 'profile' | 'post' | 'inquiry' | 'notification' | null;

const GlobalBar = () => {
  
  const logo = "https://i.ibb.co/rHPPfvt/download.webp" 
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [itemHover, setItemHover] = useState<hoverType>(null)
  const [logoHover, setLogoHover] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =useState<boolean>(false);
  const userButtonRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  const buttonList = [
    {type: 'profile',onClick: () => toggleProfileModal(),alt: 'Profile',ref: userButtonRef,tooltipContent: '프로필',src: logo},
    {type: 'post',onClick: () => navigate('/boards/submit'),tooltipContent: '글쓰기', fa: <FaPlus/>},
    {type: 'inquiry',onClick: () => navigate('/users/inquiry'),tooltipContent: '문의하기',src:"https://img.icons8.com/windows/32/question-mark.png"},
    {type: 'notification',onClick: () => toggleNotificationModal(),tooltipContent: '알림' ,ref: bellButtonRef, fa: <FaBell/>},
  ];
  
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 30) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    dispatch(
      sideButtonSliceActions.setHamburgerState({
        hamburgerState: !isSidebarOpen,
      }),
    );
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const debouncedSearch = debounce((value: string) => {
    if (value.length > 2) {
      dispatch(setSearchResults([value]));
    }
  }, 300); 

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value); 
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      clickSearch();
    }
  };

  const clickSearch = async () => {
    const viewport = window.visualViewport;
    if (viewport && viewport.width < 767) navigate('/SearchMobile');
    else{
      if (!searchTerm) {
        alert('내용을 입력해주세요');
        return;
      }
  
      await AddSearchAPI({ query: searchTerm });
      navigate(`/search/list?query=${searchTerm}`);
    }
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  const handleDetectViewPort = () => {
    const viewport = window.visualViewport;
    if (viewport && viewport.width < 767) navigate('/SearchMobile');
  };

  return (
    <div>
      <GlobalTopBar isVisible={isVisible}>
        <HamburgerMenu onClick={toggleSidebar}>
          <Bar />
          <Bar />
          <Bar />
        </HamburgerMenu>

        <LogoWrapper
          logoHover={logoHover}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          onClick={() => {window.location.href = '/'}}
        >
          <LogoImage src={logo} alt="Logo" width="50" height="50"/>
          <SiteName>제이치스</SiteName>
        </LogoWrapper>

        {/* Search Bar */}
        <SearchContainer>
          <SearchInput
            type="search"
            placeholder="게시글 & 커뮤니티 통합 검색"
            value={searchTerm}
            name={'search'}
            onChange={(e) => handleSearchChange(e)}
            onKeyDown={handleKeyDown}
            onClick={handleDetectViewPort}
          />
          <SearchIcon onClick={clickSearch} width="30" height="30" src="https://img.icons8.com/neon/96/search.png" alt="search"/>
        </SearchContainer>
        <LoginStatusView>
          {localStorage.getItem('access_token') ? (
            <>
            <ProfileModal
            isOpen={isProfileModalOpen}
            onRequestClose={toggleProfileModal}
            buttonRef={userButtonRef}
             />
            <NotificationModal
            isOpen={isNotificationModalOpen}
            onRequestClose={toggleNotificationModal}
            buttonRef={bellButtonRef}
            />
                {buttonList.map((item, index) => {
                  return(
                    <ProfileButton itemType = {item.type} userHover = {itemHover} ref={item.ref ? item.ref : null}>
                      <Tooltip id={`tooltipid${index}`} place="top" arrowColor="transparent" />
                      <Item 
                      data-tooltip-content={item.tooltipContent}
                      data-tooltip-id={`tooltipid${index}`}
                      onClick = {item.onClick} 
                      onMouseEnter={() => {setItemHover(item.type as hoverType)}}
                      onMouseLeave={() => {setItemHover(null)}}
                      >
                      {item.src ? <Icon src={item.src} /> : item.fa && React.cloneElement(item.fa, { size: 20 })}
                      </Item>
                    </ProfileButton>
                  )
                })}
            </>
          ) : (
            <>
              <UserModalForm />
            </>
          )}
        </LoginStatusView>
      </GlobalTopBar>
    </div>
  );
};

export default GlobalBar;

const GlobalTopBar = styled.nav.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible',
  })<{
  readonly isVisible: boolean;
  }>`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 0.625rem;
  border-bottom: 2px solid #d3d3d3;
  width: 100%;
  z-index: 2001;
  box-sizing: border-box;
  
  transform: translateY(0);
  transition: transform 0.27s ease-in-out;
  @media (max-width: ${breakpoints.mobile}) {
    transform: ${({ isVisible }) =>
      isVisible ? 'translateY(0)' : 'translateY(-100%)'};
  }
`;

const HamburgerMenu = styled.div`
  @media (max-width: ${breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    span {
      width: 30px;
      height: 3px;
      background-color: black;
      margin: 5px 0;
    }
  }
`;

const Bar = styled.span`
  display: block;
  width: 100%;
  height: 3px;
  background-color: black;
  border-radius: 3px;
`;

const LogoWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'logoHover',
})<{
  readonly logoHover: boolean;
}>`
  display: flex;
  align-items: center;
  background: ${(props) => (props.logoHover ? '#D3D3D3' : 'transparent')};
  border-radius: 25px;
  padding: 0.625rem;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
`;

const SiteName = styled.span`
  margin-left: 0.625rem;

  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  flex-grow: 1;
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  position: relative;
  display: flex;
  width: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 0 0 0 0;
    justify-content: flex-end;
  }
`;

const SearchInput = styled.input`
  width: 35%;
  padding: 13px;
  border-radius: 20px;
  border: 1.5px solid #ccc;
  border-color: #60afff;

  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const SearchIcon = styled.img`
  margin: 5px 20px 0 0;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 10px 5px 5px 0;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content:center;
  width: 30px;
  height: 40px;
`

const ProfileButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !['userHover', 'itemType'].includes(prop),
})<{
  readonly userHover: hoverType;
  readonly itemType: string;
}>`
  display: flex;
  align-items: center;
  justify-content:center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: ${(props) => (props.userHover === props.itemType && props.userHover !== 'profile' ? '#D3D3D3' : 'transparent')};
  cursor: pointer;
  position: relative;
  margin-top: 1vh;
`;

const Icon = styled.img`
  height: 35px;
  width: 30px;
  justify-content: center;

  @media (max-width: ) {
    margin-bottom: 2px;
  }
`;

const LoginStatusView = styled.div`
  display: flex;
  alignitems: center;
`;