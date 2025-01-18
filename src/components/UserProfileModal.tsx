import { useState } from "react";
import Modal from "./Modal";
import styled from "styled-components";
import { breakpoints } from "../_common/breakpoint";

interface UserProps{
    readonly nickname?: string;
    readonly logo: string;
}

const UserProfileModal = ({nickname,logo}: UserProps) => {

    const userImg = "https://i.ibb.co/YWrj6pL/download-1.webp" 
    const chat = "https://i.ibb.co/80x8jng/download-2.webp"

    return(
        <UserProfileContainer>
            <UserCard>
                <Logo src = {logo}/>
                <Text style = {{fontSize: '1.5rem'}}>user1</Text>
            </UserCard>

            <Menu>
                <Item> <Icon src = {userImg}/> <Text>프로필 보기</Text></Item>
                <Item> <Icon src = {chat} /> <Text>채팅 보내기</Text></Item>
            </Menu>
        </UserProfileContainer>
    )
}

export default UserProfileModal;

const UserProfileContainer = styled.div`
    display: flex;
    max-width: 400px;
    height: 350px;
    flex-direction: column;
    align-items: center;
    width: 250px;

    @media(max-width: ${breakpoints.mobile}){
        width: 100px;
    }
`

const UserCard = styled.div`
    display: flex;
    flex-direction: column;
    margin: 5vh 0 5vh 0;
    align-items: center;
`

const Logo = styled.img`
    width: 100px;
    height: 100px;
    border: 1px solid black;
    border-radius: 50px;
    margin-bottom: 10px;
`

const Icon = styled.img`'
    width: 30px;
    height: 30px;
`

const Menu = styled.div`
    display: flex;
    flex-direction: column;
`

const Item = styled.div`
    display: flex;
    margin-bottom: 1vh;
    border-bottom: 2px solid #ddd; /* 줄 색상 및 두께 설정 */
    align-items: center;

  &:last-child {
    border-bottom: none; /* 마지막 Item에는 줄 없애기 */
  }
`

const Text = styled.p`
    cursor: pointer;
    margin: 0 0 0 10px;
    font-size: 1.2rem
`