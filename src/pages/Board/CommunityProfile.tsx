import styled from "styled-components";
import logo from '../../assets/img/panda_logo.png'

interface ProfileParams {
     name: string
     description: string;
     icon: string | null | undefined
  };

const CommunityProfile = ({icon, name,description}:ProfileParams) => {
    return(
        <>
            <CommunityInfoContainer>
                <ProfileCircle>
                    <ProfileImage src = {icon === null ? logo : `${icon}`} alt ='Description'/>
                </ProfileCircle>
                <CommunityNameWrapper>
                    <CommunityName>
                        {name}
                    </CommunityName>
                </CommunityNameWrapper>
            </CommunityInfoContainer>
        </>
    )
}

const CommunityInfoContainer = styled.div`
    display: flex;
    top: 35vh;
    left: 25%;
    position: absolute;
`

const ProfileCircle = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 75px;
    display: flex;
    border: 2px solid black;
`

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 75px;
`

const CommunityNameWrapper = styled.div`
    top: 40vh;
    display: flex;
    margin-top: 14vh;
`

const CommunityName = styled.h1`
    font-size: 2em;
    color: #333;
`

export default CommunityProfile;