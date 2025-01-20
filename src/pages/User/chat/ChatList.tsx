import { useEffect, useState } from "react";
import styled from "styled-components";

const ChatList = () => {

    const selectChat = () => {

    }

    const List = ['100','100','500','800','600','8000']
    return(
        <ChatListContainer>

            <Header>
                <Title>Message</Title>
                <Icon width = '50px' height = '50px' src = "https://i.ibb.co/rHPPfvt/download.webp"/>
            </Header>

            <Body>
                {List.map((item,index) => {
                    return(
                        <Item onClick = {selectChat}>
                            <ProfileImage width = '60px' height = '60px' src = "https://i.ibb.co/rHPPfvt/download.webp"/>
                            <div style = {{display:'flex', flexDirection: 'column'}}>
                                <Nickname>user1</Nickname>
                                
                            </div>
                        </Item>
                    )
                })}
            </Body>
        </ChatListContainer>
    )
}

export default ChatList;

const ChatListContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 10%;
`

const Title = styled.div`
    font-size: 2rem;
    margin-left: 5%;
`

const Icon = styled.img`
    margin: 0 10% 0 auto;

`

const Body = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    margin: 0 auto 5% auto;
    border-bottom: 2px solid #f0f0f0;
    justify-content: center;
`

const Item = styled.div`
    display: flex;
    margin: 0 0 10% 0;
    
`

const ProfileImage = styled.img`
    border-radius: 50px;
    border: 1px solid black;
`

const Nickname = styled.p`
    font-size: 1.2rem;
    margin: 5px 0px 0px 20px;
    font-family: Times New Roman !important;
`