import styled from "styled-components";
import { LeftArrow } from "../../../assets/img/ImgUrl";
import { breakpoints } from "../../../_common/breakpoint";


interface ChatProps {
    readonly logo?: string;
    readonly nickname?: string;
    readonly setSelectedChat?: (item: boolean) => void;
}

const ChatRoom = ({logo, nickname,setSelectedChat}:ChatProps) => {

    const handleBack = () => {
        if(!setSelectedChat) return
        setSelectedChat(false)
    }

    return(
        <ChatContainer>

            <Header>
                <Arrow width = '30px' height = '30px' src = {LeftArrow} onClick={handleBack}/>
                <Logo width = '35px' height = '35px' src = "https://i.ibb.co/rHPPfvt/download.webp" />
                <Text>user1</Text>
            </Header>

            <Body>
                <Logo  width = '120px' height = '120px' src = "https://i.ibb.co/rHPPfvt/download.webp"/>
                <Text>user1</Text>
            </Body>

            <SubmitMessage>
            <MessageInput placeholder="메시지를 입력하세요" />
            <SendButton>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
                </svg>
            </SendButton>
            </SubmitMessage>
        </ChatContainer>
    )
}

export default ChatRoom;

const ChatContainer = styled.div`
    display: flex;
    width: 480px;
    height: 100vh;
    flex-direction: column;
    overflow-y: scroll;

    @media(max-width: ${breakpoints.tablet}){
        height: 130vh;
    }
`

const Header = styled.div`
    display: flex;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    height: 80px;
`

const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 25% 0 0 0;
`

const SubmitMessage = styled.div`
    margin: auto 0 0 10px;
    box-shadow: 8px 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 24px;
    padding: 8px 16px;
    background-color: #fff;
    width: 85%;
`

const Logo = styled.img`
    border: 1px solid black;
    border-radius: 75px;
    margin: 0 2% 0 2%;
`

const Text = styled.p`
    font-size: 1.2rem;
`

const MessageInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background-color: transparent;
  padding: 0 8px;

  &::placeholder {
    color: #aaa;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4f46e5;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: #fff;
  padding: 0;

  &:hover {
    background-color: #4338ca;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Arrow = styled.img`
    width: 30px;
    heightL 30px;

    @media(min-width: ${breakpoints.mobile}){
    display: none;
    }
`