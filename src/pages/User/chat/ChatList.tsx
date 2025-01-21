import styled from "styled-components";
import { breakpoints } from "../../../_common/breakpoint";


interface ChatListProps {
    readonly selectedChat: boolean;
    readonly setSelectedChat: (item: boolean) => void;
}

const ChatList = ({selectedChat,setSelectedChat}:ChatListProps) => {

    const List = ['100','500','9800','4450','9510','774','0','100','500','9800','4450','9510','774','0']
   

    const handleSelect = () => {
        if(window.innerWidth < 768){
            
        }
    }

    return(
        <ChatListContainer>

            <Header>
                <Title>Message</Title>
                <Icon width = '50px' height = '50px' src = "https://i.ibb.co/rHPPfvt/download.webp"/>
            </Header>

            <Body>
                {List.map((item,index) => {
                    return(
                        <Item 
                        onDoubleClick = {handleSelect}
                        onTouchEnd = {handleSelect}
                        >
                            {item.length > 0 ?
                            <>
                            <ProfileImage width = '60px' height = '60px' src = "https://i.ibb.co/rHPPfvt/download.webp"/>
                            <div style = {{display:'flex', flexDirection: 'column'}}>
                                <Nickname>user1</Nickname>
                                
                            </div>
                            </> : 
                            <Text>
                            채팅을 시작해 보세요!    
                            </Text>}
                        </Item>
                    )
                })}
            </Body>
        </ChatListContainer>
    )
}

export default ChatList;

const ChatListContainer = styled.div`
    height: 100vh;
    width: 400px;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;

    @media(max-width: ${breakpoints.mobile}){
        height: 130vh;
        width: 100%;
    }

    @media(min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}){
        height: 130vh;
    }
`

const Header = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 10%;
    padding: 15px 0 15px 0;
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
    cursor: pointer;
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

const Text = styled.p`
    font-size: 1.4rem;
    color: gray;
    margin: 80% 0 0 23%;
    text-align: center;
`