import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .ReactVirtualized__Grid__innerScrollContainer {
    position: static !important;
  }
  .ReactVirtualized__Grid.ReactVirtualized__List {
    position: static !important;
  }
  .ReactVirtualized__Grid__innerScrollContainer .modalContainer {
    left: 40% !important;
  }

`;

export default GlobalStyle;
/* Card컴포넌트에 UserProfileModal의 위치 조정을 위한 파일 없으면 UserProfileModal만 다른 modal들이랑 위치 다르게 엇나감 */