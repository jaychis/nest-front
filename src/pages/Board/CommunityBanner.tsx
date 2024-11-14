import styled from "styled-components"
import logo from '../../assets/img/logo.png'
import CommunityProfile from "./CommunityProfile"
import { community,SelectCommunityParams } from "../../reducers/communitySlice"
import { useSelector } from "react-redux"
import { CommunityUpdateAPI } from "../api/communityApi"

const CommunityBanner = () => {

    const selectCommunity: SelectCommunityParams = useSelector((state:any) => state.community)
    console.log(selectCommunity)
    return(
        <>
            <BackgroundContainer>
                <BackgroundImage src = {selectCommunity.banner === null ? logo : `${selectCommunity.banner}`} alt="Description"/>
                <CommunityProfile
                id = {selectCommunity.id}
                icon = {selectCommunity.icon}
                name = {selectCommunity.name}
                description={selectCommunity.description}
                banner={selectCommunity.banner}
                visibility={selectCommunity.visibility}
                />
            </BackgroundContainer>
        </>
    )
}

const BackgroundContainer = styled.div`
    display: flex;
    width: 100%;
    height: 40vh;
    margin-bottom: 10vh;
`

const BackgroundImage = styled.img`
    width: 100%;
    height: 100%;
`


export default CommunityBanner