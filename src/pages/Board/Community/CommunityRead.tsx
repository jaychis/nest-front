import InfinitiList from "../../../components/InfinityList";
import styled from "styled-components";
import CommunityBanner from "./CommunityBanner";
import GlobalStyle from "../../../_common/globalStyled";
import { breakpoints } from "../../../_common/breakpoint";
import { sideButtonSliceActions } from "../../../reducers/mainListTypeSlice";
import { useDispatch } from "react-redux";
import { MainListTypes } from "../../../_common/collectionTypes";
import { useState,useEffect } from "react";

const CommunityRead = () => {

    const dispatch = useDispatch()
    const [reload, setReload] = useState<boolean>(false)

    useEffect(() => {
        const [navigationEntry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        
        if (navigationEntry?.type === "reload") {
            const communityName = sessionStorage.getItem("community_name");
            if (communityName) {
                dispatch(sideButtonSliceActions.setButtonType({ buttonType: communityName as MainListTypes }));
            }
        } 
        setReload(true)
    }, []);

    if(!reload){
        return(<></>)
    }

    return(
        <MainContainer>
            <CommunityBanner/>
            <CardsContainer>
                <GlobalStyle/>
                <InfinitiList/>
            </CardsContainer>
        </MainContainer>
    )
}

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

export default CommunityRead;