import styled from "styled-components";
import logo from '../../assets/img/panda_logo.png'
import DropDown from "../../components/Dropdown";
import { useState,useRef,useEffect } from "react";

interface ProfileParams {
     name: string
     description: string;
     icon: string | null | undefined
  };

const CommunityProfile = ({icon, name,description}:ProfileParams) => {

    const [editList, setEditList] = useState<string[]>(['이름 변경','배경화면 변경', '프로필 사진 변경'])
    const [view, setView] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event:any) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setView(false); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                <EditButton onClick = {() => {setView(!view)}}>
                    <EditIcon src="https://img.icons8.com/material-outlined/24/menu-2.png" alt="menu-2"/>
                </EditButton>

                {view && (
                <DropDownElement>
                    <DropDown 
                    ref = {dropDownRef}
                    menu = {editList}/>
                </DropDownElement>)}
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

const EditButton = styled.div`
    position: absolute;
    top: 18vh;
    left: 55vw
`

const EditIcon = styled.img`
    cursor: pointer;
    width: 24px;
    height: 24px;
`

const DropDownElement = styled.div`
    position: absolute;
    top: 20vh;
    left: 47.5vw
`

export default CommunityProfile;