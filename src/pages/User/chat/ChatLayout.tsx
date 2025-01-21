import { useState } from "react";
import styled from "styled-components";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";

const ChatLayout = () => {

    const [selectedChat, setSelectedChat] = useState<boolean>(false);
    const clientWidth = window.innerWidth <= 1024

    return(
        <LayoutContainer>
        <ChatList/>
        {!selectedChat && (<ChatRoom/>)}
        </LayoutContainer>
    )
}

export default ChatLayout;

const LayoutContainer = styled.div`
    display: flex;

`

