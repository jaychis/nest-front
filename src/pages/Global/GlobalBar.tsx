import React, { useRef, useState, useEffect,lazy } from 'react';
import { FaSistrix } from '@react-icons/all-files/fa/FaSistrix';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { FaBell } from '@react-icons/all-files/fa/FaBell';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AddSearchAPI } from '../api/searchApi';
import { setSearchResults } from '../../reducers/searchSlice';
import { RootState, AppDispatch } from '../../store/store';
import debounce from 'lodash.debounce';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import { sideButtonSliceActions } from '../../reducers/mainListTypeSlice';
import { breakpoints } from '../../_common/breakpoint';

const UserModalForm = lazy(() => import('../User/UserModalForm'));
const ProfileModal = lazy(() => import('../User/ProfileModal'));
const NotificationModal = lazy(() => import('../User/NotificationModal'));

const GlobalBar = () => {
  const logo = "https://i.ibb.co/rHPPfvt/download.webp" 
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults,
  );
  const postSubmit = () => navigate('/boards/submit');
  const [userHover, setUserHover] = useState<boolean>(false);
  const [bellHover, setBellHover] = useState<boolean>(false);
  const [logoHover, setLogoHover] = useState<boolean>(false);
  const [plusHover, setPlusHover] = useState<boolean>(false);
  const [inquiryHover, setInquiryHover] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState<boolean>(false);
  const userButtonRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

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
  }, 300); // 300ms 디바운싱

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value); // Use debounced search
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      clickSearch();
    }
  };

  const clickSearch = async () => {
    if (!searchTerm) {
      alert('내용을 입력해주세요');
      return;
    }

    await AddSearchAPI({ query: searchTerm });
    navigate(`/search/list?query=${searchTerm}`);
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  const handleLogoClick = () => {
    window.location.href = '/';
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

        {/* Logo and Site Name */}
        <LogoWrapper
          logoHover={logoHover}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          onClick={handleLogoClick}
        >
          <LogoImage src={logo} alt="Logo" />
          <SiteName>{'제이치스'}</SiteName>
        </LogoWrapper>

        {/* Search Bar */}
        <SearchContainer>
          <SearchInput
            type="search"
            placeholder="Search"
            value={searchTerm}
            name={'search'}
            onChange={(e) => handleSearchChange(e)}
            onKeyDown={handleKeyDown}
            onClick={handleDetectViewPort}
          />
          <SearchIcon onClick={handleDetectViewPort} />
        </SearchContainer>

        {/* Navigation Icons */}
        <LoginStatusView>
          {localStorage.getItem('access_token') ? (
            <>
              <ProfileButton
                ref={userButtonRef}
                userHover={userHover}
                onMouseEnter={() => setUserHover(true)}
                onMouseLeave={() => setUserHover(false)}
                onClick={toggleProfileModal}
              >
                <ProfileImage src={logo} alt="Profile"  />
              </ProfileButton>
              <ProfileModal
                isOpen={isProfileModalOpen}
                onRequestClose={toggleProfileModal}
                buttonRef={userButtonRef}
              />

              <PostButtonContainer
                plusHover={plusHover}
                onMouseEnter={() => setPlusHover(true)}
                onMouseLeave={() => setPlusHover(false)}
              >
                <SubmitButton plusHover={plusHover} onClick={postSubmit}>
                  <Tooltip id="tooltip" place="top" arrowColor="transparent" />
                  <PlusIcon
                    data-tooltip-content="글쓰기"
                    data-tooltip-id="tooltip"
                  />
                </SubmitButton>
              </PostButtonContainer>

              {/* Plus/Create Icon */}
              <InquiryButtonContainer
                inquiryHover={inquiryHover}
                onMouseEnter={() => setInquiryHover(true)}
                onMouseLeave={() => setInquiryHover(false)}
              >
                <InquiryButton
                  inquiryHover={inquiryHover}
                  onClick={() => navigate('/users/inquiry')}
                >
                  <Tooltip id="tooltip2" place="top" arrowColor="transparent" />
                  <InquiryIcon
                    data-tooltip-content="문의하기"
                    data-tooltip-id="tooltip2"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7klEQVR4nO3Yz4uNURzH8df4kfyakowsLGQU2diIiMjKhkiilJ3ZmRr/gFhYs5iFslMWSikLWSkZUjY2QpRQfqc0fvPoqe/iaRjm3rn3Pj867zrdOs/5fp9z7nnO5/v9HhKJRCJREllDmsYtpK5kjV3IoPox+LeFvMMW9WEDXk122L/ggOqzB+OTHfbR+P2JEdVlJOZYnPMfh324MOgsZqkOM3Em5vYLx/+nWnvxKfquYqHymY/Lhc//4FTldyNeR/8dLFUei3GzIEhbW40jK/Egnj3BGuXI68OYw2Osbjcg5v/GjXj+Htv0jk14E+++jYHpRvY5uBBjvuKQ7rMPn+OdlzCvUylKX6jERMXoBsMF5TyNGd3ItY7ge4w/h9k6K6+j4fsHjnY7adxdiKrX0G/6LMCV8Jl/Uvt7lf2ux8uwu4fl2mcZ7oavt9jc6zR+Be6H7Qusa8PHWjwNH4+wqqx6ZBGuh/1H7GzBdgc+hO0YlpRdWOXyfD585EIwNAWbw/gWNhcxtyoVYh9OFeT5RKjQRPK+kzEmC5vctnKl7lBBnvP8aFdE5IFQu7EWd67Umn07nv/jtuNZjKnF5UM/jkWONB7tVhRFnS4LssbeotSVLC2kYmRpRypGlnakYmSN3ZGs5k1jFpJIJBIJveY3S2K8l4EjqFIAAAAASUVORK5CYII="
                  />
                </InquiryButton>
              </InquiryButtonContainer>

              <NotificationButtonContainer
                bellHover={bellHover}
                onMouseEnter={() => setBellHover(true)}
                onMouseLeave={() => setBellHover(false)}
                onClick={() => {
                  toggleNotificationModal();
                }}
              >
                <BellIcon bellHover={bellHover} />
              </NotificationButtonContainer>

              <NotificationModal
                isOpen={isNotificationModalOpen}
                onRequestClose={toggleNotificationModal}
                buttonRef={bellButtonRef}
              />
              {/* Notification Icon */}
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
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;

  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const SearchIcon = styled(FaSistrix)`
  margin-right: 20px;
  width: 30px;
  height: 30px;
  margin-top: 5px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 0 5px 5px 0;
  }
`;

const ProfileButton = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'userHover',
})<{
  readonly userHover: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: ${(props) => (props.userHover ? '#D3D3D3' : 'transparent')};
  cursor: pointer;
  position: relative;
  margin-top: 1vh;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  z-index: 2;
`;

const PostButtonContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'plusHover',
})<{
  readonly plusHover: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  border-radius: 25px;
  margin-left: 5px;
  background: ${(props) => (props.plusHover ? '#D3D3D3' : 'white')};
`;

const SubmitButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'plusHover',
})<{
  readonly plusHover: boolean;
}>`
  border: none;
  background: ${(props) => (props.plusHover ? '#D3D3D3' : 'white')};
  cursor: pointer;
`;

const PlusIcon = styled(FaPlus)`
  height: 52.5px;
  width: 24px;

  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: 2px;
  }
`;

const InquiryButtonContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'inquiryHover',
})<{
  readonly inquiryHover: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  border-radius: 25px;
  background: ${(props) => (props.inquiryHover ? '#D3D3D3' : 'white')};
`;

const InquiryButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'inquiryHover',
})<{
  readonly inquiryHover: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-size: 16px;
  border-radius: 25px;
  background: ${(props) => (props.inquiryHover ? '#D3D3D3' : 'white')};
  cursor: pointer;
  height: 60px;
  width: 60px;
`;

const InquiryIcon = styled.img`
  height: 57.5%;
  width: 57.5%;

  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: 2px;
  }
`;

const NotificationButtonContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'bellHover',
})<{
  readonly bellHover: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: ${(props) => (props.bellHover ? '#D3D3D3' : 'transparent')};
  cursor: pointer;
  margin-right: 2vw;
`;

const BellIcon = styled(FaBell).withConfig({
  shouldForwardProp: (prop) => prop !== 'bellHover',
})<{
  readonly bellHover: boolean;
}>`
  color: ${(props) => (props.bellHover ? 'white' : 'black')};
  width: 25px;
  height: 25px;
  margin-right: 1vw;
  margin-top: 1vh;

  @media (max-width: ${breakpoints.mobile}) {
    margin-right: 8vw;
  }
`;

const LoginStatusView = styled.div`
  display: flex;
  alignitems: center;
`;
