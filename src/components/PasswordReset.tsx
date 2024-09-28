import styled from "styled-components"

interface Props {
    readonly modalIsOpen: (state: boolean) => void,
    readonly onSwitchView:() => void
}

const PassWordReset = ({onSwitchView, modalIsOpen}:Props) => {
    return(
        <Container>
            <HeaderTitleWrapper>
                <Title>비밀번호 변경</Title>
            </HeaderTitleWrapper>
            <UserRecoveryContainer>
                <UserRecoveryForm>
                    <Input 
                    placeholder="이메일 *"
                    type="email"
                    id="email"
                    name="email"
                    />

                </UserRecoveryForm>
            </UserRecoveryContainer>
            
            <FooterWrapper>
                <SubmitButton>비밀번호 찾기</SubmitButton>
                <SwitchButton onClick = {onSwitchView}>로그인으로 전환</SwitchButton>
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

const Input = styled.input`
    min-width: 400px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    box-sizing: border-box;
    height: 40px;
`

const UserRecoveryForm = styled.form`
    
`

const SubmitButton = styled.button`
    padding: 10px 20px;
    width: 200px;
    border-radius: 25px;
    border: none;
    background-color: #84d7fb;
    color: white;
    cursor: pointer;
    margin-bottom: 10px;
  &:hover {
    background-color: #72c2e9; // 예시: 호버 시 색상 변경
  }
`;

const FooterWrapper = styled.div`
    width: 100%;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: auto;
`;

const SwitchButton = styled.button`
    padding: 10px 20px;
    width: 200px;
    border-radius: 25px;
    border: none;
    background-color: #000;
    color: white;
    cursor: pointer;

    &:hover {
        background-color: #333; //
`;