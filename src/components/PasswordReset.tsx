import styled from 'styled-components';

type modalType = 'login' | 'signup' | 'recovery' | 'verity';
interface Props {
  readonly title: string;
  readonly body: React.ReactNode;
  readonly footer?: React.ReactNode;
}

const PassWordReset = ({
  title,
  body,
  footer,
}: Props) => {
  return (
    <Container>
      <HeaderTitleWrapper>
        <Title>{title}</Title>
      </HeaderTitleWrapper>

      <UserRecoveryContainer>
        <UserRecoveryForm>{body}</UserRecoveryForm>
      </UserRecoveryContainer>

      <FooterWrapper>{footer}</FooterWrapper>
    </Container>
  );
};

export default PassWordReset;

const Container = styled.div`
  min-width: 400px;
  max-width: 600px;
  width: 80%;
  display: flex;
  background: #fff;
  flex-direction: column;

  border-radius: 25px;
  padding: 20px;
`;

const HeaderTitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h2``;

const UserRecoveryContainer = styled.div`
  margin-bottom: 10px;
  display: inline;
  text-align: center;
  width: 100%;
`;

const UserRecoveryForm = styled.form``;

const FooterWrapper = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: auto;
`;
