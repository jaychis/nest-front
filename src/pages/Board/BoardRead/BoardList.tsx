import styled from 'styled-components';
import { breakpoints } from '../../../_common/breakpoint';
import GlobalStyle from '../../../_common/globalStyled';
import { useBeforeUnload } from 'react-router-dom';
import InfinitiList from '../../../components/InfinityList';

const BoardList = () => {

  useBeforeUnload((event) => {
    sessionStorage.setItem("scrollIndex", '0');
  })

  return (
    <MainContainer>
      <CardsContainer>
        <GlobalStyle />
        <InfinitiList/>
      </CardsContainer>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-left: 2%;
 
  @media (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
    max-width: 100%;
  }
`;

const CardsContainer = styled.div`
  width: 100%;
  height: 85vh;
  box-sizing: border-box;
  display: flex;

  @media (max-width: ${breakpoints.mobile}) {
    height: 120vh;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
    height: 110vh;
  }
`;

export default BoardList;