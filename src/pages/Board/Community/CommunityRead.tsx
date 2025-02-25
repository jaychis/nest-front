import BoardList from "../BoardRead/BoardList";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import CommunityBanner from "./CommunityBanner";
import CommunityProfile from "./CommunityProfile";

const CommunityRead = () => {

    return(
        <CommunityReadContainer>
            <CommunityHeader>
                <CommunityBanner/>
                <CommunityProfile/>
            </CommunityHeader>
            
            <BoardList/>
        </CommunityReadContainer>
    )
}

const CommunityReadContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 120vh;
 
`

const CommunityHeader = styled.div`
    display: flex;
    width: 100%;
`

const CommunityList = styled.div`
   
`

export default CommunityRead;