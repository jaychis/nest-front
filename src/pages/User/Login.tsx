import React, { MouseEventHandler, useEffect, useState } from 'react';
import { CollectionTypes } from '../../_common/collectionTypes';
import { isValidPasswordFormat } from '../../_common/passwordRegex';
import { FaComment } from '@react-icons/all-files/fa/FaComment';
import Alert from '../../components/Alert';
import { LoginAPI, LoginParams, RefreshTokenAPI } from '../api/userApi';
import { KakaoOAuthLoginAPI } from '../api/oAuthApi';
import styled from 'styled-components';
type modalType = 'login' | 'signup' | 'recovery' | 'verity';

interface Props {
  readonly onSwitchView: (view: modalType) => void;
  readonly modalIsOpen: (state: boolean) => void;
  readonly kakaoEmail: string;
  readonly setKakaoEmail: (state: string) => void;
}
const Login = ({
  onSwitchView,
  modalIsOpen,
  kakaoEmail,
  setKakaoEmail,
}: Props) => {
  const [login, setLogin] = useState<LoginParams>({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  
  const setLoginProcess = ({
    id,
    nickname,
    access_token,
    refresh_token,
  }: {
    readonly id: string;
    readonly nickname: string;
    readonly access_token: string;
    readonly refresh_token: string;
  }) => {
    modalIsOpen(false);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('id', id);
    localStorage.setItem('nickname', nickname);
    setShowAlert(true); // 알람 표시
    setShowAlert(false); // 알람 숨기기
    window.location.reload();
  };

  const handleChange = (event: CollectionTypes): void => {
    const { name, value } = event;

    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    processLogin();
  };

  const processLogin = async () => {
    const isPasswordValid: boolean = isValidPasswordFormat(login.password);
    const isEmailValid: boolean = /\S+@\S+\.\S+/.test(login.email);
    if (!isEmailValid) {
      setErrorMessage('유효한 이메일 주소를 입력하세요.');
      return;
    }

    if (isPasswordValid) {
      try {
        const res = await LoginAPI(login);
        const response = res.data.response;
        const { id, nickname, access_token, refresh_token } = response;

        if (res.status === 201 && response) {
          setLoginProcess({
            id,
            nickname,
            access_token,
            refresh_token,
          });
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          try {
            const refreshRes = await RefreshTokenAPI();
            const refreshResponse = refreshRes.data.response;
            const { access_token, refresh_token } = refreshResponse;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            const retryRes = await LoginAPI(login);
            const retryResponse = retryRes.data.response;
            const { id, nickname } = retryResponse;

            setLoginProcess({
              id,
              nickname,
              access_token,
              refresh_token,
            });
          } catch (refreshErr) {
            setErrorMessage('세션이 만료되었습니다. 다시 로그인해 주세요.');
            console.error(refreshErr);
            localStorage.clear();
            modalIsOpen(true);
          }
        } else {
          setErrorMessage('로그인 실패. 이메일과 비밀번호를 확인하세요.');
          console.error(err);
        }
      }
    } else {
      setErrorMessage(
        '비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다.',
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 기본 동작 방지
      processLogin();
    }
  };

  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID as string;

  const env = process.env.REACT_APP_NODE_ENV as keyof typeof REDIRECT_URLS;
  
  const REDIRECT_URLS: {
    readonly production: string;
    readonly stage: string;
    readonly development: string;
  } = {
    production: process.env.REACT_APP_KAKAO_REDIRECT_URL as string,
    stage: process.env.REACT_APP_KAKAO_STAGE_REDIRECT_URL as string,
    development: process.env.REACT_APP_KAKAO_TEST_REDIRECT_URL as string,
  };
  const REDIRECT_URI = REDIRECT_URLS[env] as string;

  const goSignup = () => onSwitchView('signup');

  const kakaoOauthLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

    const popup = window.open(
      KAKAO_AUTH_URL,
      'PopupWin',
      'width=500,height=600',
    );
    if (!popup) {
      console.error(
        '팝업 창을 열 수 없습니다. 팝업 차단이 설정되었는지 확인하세요.',
      );
      return;
    }

    // 팝업에서 부모 창으로 메시지가 전달될 때를 위한 이벤트 리스너
    window.addEventListener(
      'message',
      async (event) => {
        if (event.origin !== window.location.origin) {
          return;
        }
        const { code } = event.data;
        if (code) {
          const response = await KakaoOAuthLoginAPI({ code });
          if (!response) return;
          
          const {
            id,
            nickname,
            access_token,
            refresh_token,
            isNewUser,
            email,
          } = response.data.response as {
            readonly id: string;
            readonly email: string;
            readonly nickname: string;
            readonly access_token: string;
            readonly refresh_token: string;
            readonly isNewUser: boolean;
          };

          if (!isNewUser) {
            modalIsOpen(false);
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('id', id);
            localStorage.setItem('nickname', nickname);
            window.location.reload();
          } else {
            localStorage.setItem('email', email);
            goSignup();
          }
        }
      },
      { once: true },
    );
  };

  useEffect(() => {
    if (window.opener) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        window.opener.postMessage({ code }, window.location.origin);
        window.close();
      }
    }
  }, []);

  return (
    <Container>
      {showAlert && (
        <Alert
          message="로그인이 완료되었습니다."
          onClose={() => setShowAlert(false)}
          type="success"
        />
      )}
      <div>
        <Header>
          <h2>로그인</h2>
        </Header>

        <SocialButtonsContainer>
          <SocialButton
            onClick={() => {
              kakaoOauthLogin();
            }}
          >
            <FaComment /> 카카오로 로그인
          </SocialButton>
        </SocialButtonsContainer>

        <OrContainer>
          <OrLine />
          <OrText>OR</OrText>
          <OrLine />
        </OrContainer>

        <form>
          <Input
            placeholder="이메일 *"
            type="email"
            id="email"
            name="email"
            data-testid = 'email-input'
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            onKeyDown={handleKeyDown}
            required
          />
          <Input
            placeholder="비밀번호 *"
            type="password"
            id="password"
            name="password"
            data-testid='password-input'
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            onKeyDown={handleKeyDown}
            required
          />
          {errorMessage && <ErrorText data-testid = 'error-text'>{errorMessage}</ErrorText>}
          <ForgotPasswordContainer>
            <ForgotPasswordLink onClick={() => onSwitchView('recovery')}>
              비밀번호를 잊으셨나요?
            </ForgotPasswordLink>
          </ForgotPasswordContainer>
        </form>

        <SubmitContainer>
          <SubmitButton data-testid = 'submit-button' type="submit" onClick={handleSubmit}>
            로그인
          </SubmitButton>
        </SubmitContainer>
        <SwitchContainer>
          <SwitchButton onClick={goSignup}>회원가입</SwitchButton>
        </SwitchContainer>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  border-radius: 25px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2001;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
  height: 40px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
`;

const OrContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #aaa;
  margin: 20px 0;
`;

const OrLine = styled.div`
  flex: 1;
  height: 1px;
  background: #aaa;
`;

const OrText = styled.div`
  margin: 0 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
`;

const ForgotPasswordContainer = styled.div`
  width: 100%;
  padding: 10px 0;
  text-align: right;
`;

const ForgotPasswordLink = styled.a`
  font-size: 14px;
  color: #007bff;
  cursor: pointer;
`;

const SubmitContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  width: 200px;
  border-radius: 25px;
  border: none;
  background-color: #84d7fb;
  color: white;
  cursor: pointer;
`;

const SwitchContainer = styled.div`
  width: 100%;
  padding: 10px 0;
  text-align: center;
`;

const SwitchButton = styled.button`
  padding: 10px 20px;
  width: 200px;
  border-radius: 25px;
  border: none;
  background-color: red;
  color: white;
  cursor: pointer;
`;

const ErrorText = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default Login;
