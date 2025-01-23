import styled,{keyframes} from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { breakpoints } from "../_common/breakpoint";
import GlobalBar from "../pages/Global/GlobalBar";
import GlobalSideBar from "../pages/Global/GlobalSideBar";
import RightSideBar from "../pages/Global/RightSideBar";

const Layout = ({ children }: { readonly children: React.ReactNode }) => {
    const { hamburgerState } = useSelector(
      (state: RootState) => state.sideBarButton,
    );
  
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

export default Layout;

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

const GlobalSideBarContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ readonly isOpen: boolean }>`
    width: 200px;
    height: 100%;
    position: fixed;

    @media (max-width: ${breakpoints.mobile}) {
    left: ${(props) => (props.isOpen ? '0' : '150px')};
    z-index: 50;
    overflow: visible;
    animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.5s forwards;

    // visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transition:
        opacity 0.5s,
        visibility 0.5s;
    }
`;

const MainContent = styled.div`
    width: 100%;
    height: 100%;
    flex: 1;
    margin: 80px 0 0 200px;
    padding-top: 10px;
    overflow: hidden;

    @media (max-width: ${breakpoints.mobile}) {
    margin: 80px 0 0 0;
    max-width: 100%;
    }
`;