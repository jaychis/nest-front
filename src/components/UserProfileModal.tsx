import styled from "styled-components";
import { breakpoints } from "../_common/breakpoint";
import { useNavigate } from "react-router-dom";

interface UserProps{
    readonly nickname?: string;
    readonly logo: string;
    readonly id: string;
}

const UserProfileModal = ({nickname,logo,id}: UserProps) => {

    const userImg = "https://i.ibb.co/YWrj6pL/download-1.webp" 
    const chat = "https://i.ibb.co/80x8jng/download-2.webp"
    const navigate = useNavigate()

    return(
        <UserProfileContainer>
            <UserCard>
                <Logo src = {logo}/>
                <Text style = {{fontSize: '1.5rem'}}>{nickname}</Text>
            </UserCard>

            <Menu>
                <Item> <Icon src = {userImg}/> <Text onClick = {() => {navigate(`/users/profile/${id}`)}}>프로필 보기</Text></Item>
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
    width: 150px;
    align-items: center;
    
    @media(max-width: ${breakpoints.mobile}){
    margin-left: -20%;
    }
`

const Item = styled.div`
    display: flex;
    margin-bottom: 1vh;
    border-bottom: 2px solid #ddd; 
    align-items: center;

  &:last-child {
    border-bottom: none;
  }
`

const Text = styled.p`
    cursor: pointer;
    margin: 0 0 0 10px;
    font-size: 1.2rem
`