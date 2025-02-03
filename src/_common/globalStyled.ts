import { createGlobalStyle } from "styled-components";
import { breakpoints } from "./breakpoint";

const GlobalStyle = createGlobalStyle`
  .ReactVirtualized__Grid__innerScrollContainer .modalContainer {
    left: 40% !important;
  }

  .ReactVirtualized__Grid__innerScrollContainer .CardContainer {
    margin-left: 10vw;

    @media (max-width: ${breakpoints.mobile}) {
        margin: 0 0 5px 0;
      }
  }

`;

export default GlobalStyle;
/* Card컴포넌트에 UserProfileModal의 위치 조정을 위한 파일 없으면 UserProfileModal만 다른 modal들이랑 위치 다르게 엇나감 */