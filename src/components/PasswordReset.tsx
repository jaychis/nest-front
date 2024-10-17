import styled from "styled-components"
import { SendEmail } from "../pages/api/UserApi"

type modalType = "login" | "signup" | "recovery" | "verity";
interface Props {
    readonly title:string;
    readonly modalIsOpen: (state: boolean) => void;
    readonly onSwitchView: (view: modalType) => void;
    readonly body: React.ReactNode;
    readonly footer?: React.ReactNode;
}

const PassWordReset = ({title,body,footer,onSwitchView, modalIsOpen}:Props) => {

    return(
        <Container>
            <HeaderTitleWrapper>
                <Title>{title}</Title>
            </HeaderTitleWrapper>

            <UserRecoveryContainer>
                <UserRecoveryForm>
                    {body}
                </UserRecoveryForm>
            </UserRecoveryContainer>
            
            <FooterWrapper>
                {footer}
            </FooterWrapper>
        </Container>
    )
}

export default PassWordReset;

const Container = styled.div`
    min-width: 400px; 
    max-width: 600px;
    width: 80%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    background: #fff;
    flex-direction: column;
    
    border-radius: 25px;
    padding: 20px;
`

const HeaderTitleWrapper = styled.div`
    text-align: center;
    margin-bottom: 20px;
`

const Title = styled.h2`
`

const UserRecoveryContainer = styled.div`
    position: relative;
    margin-bottom: 10px;
    display: flex;
    text-align: center;
    width: 100%;
`

const UserRecoveryForm = styled.form`
    
`

const FooterWrapper = styled.div`
    width: 100%;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: auto;
`;