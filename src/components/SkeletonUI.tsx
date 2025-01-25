import styled from "styled-components";
import { breakpoints } from "../_common/breakpoint";

const SkeletonUI = () => {

    return(
        <SkeletonContainer>
            Hello World
        </SkeletonContainer>
    )
}

export default SkeletonUI

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 250px;
  max-height: 650px;
  max-width: 700px;
  margin-left: 10vw;
  padding: 0 15px;
  position: relative;
  object-fit: contain;
  box-sizing: border-box;
  border-radius: 30px;

  @media (max-width: ${breakpoints.tablet}) {
      margin: 0 0 5px 0;
    }
`