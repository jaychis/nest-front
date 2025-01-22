import { useState, useEffect } from "react";
import styled from "styled-components";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";

const ChatLayout = () => {

    const [selectedChat, setSelectedChat] = useState<boolean>(false);
    const [clientWidth,setClientWidth] = useState<boolean>(window.innerWidth >= 767);

    useEffect(() => {
        const handleResize = () => {
            setClientWidth(window.innerWidth >= 767);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    return(
        <LayoutContainer>
        {selectedChat && !clientWidth ? 
        <ChatRoom 
        setSelectedChat={setSelectedChat}
        /> : 
        <ChatList 
        selectedChat={selectedChat} 
        setSelectedChat={setSelectedChat}
        />
        }
        {(selectedChat && clientWidth) && (<ChatRoom/>)}
        </LayoutContainer>
    )
}

export default ChatLayout;

const LayoutContainer = styled.div`
    display: flex;
`

