import './UserModalForm.css';
import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Login from './Login';
import Signup from './Signup';
import PassWordReset from '../../components/PasswordReset';
import styled from 'styled-components';
import { SendEmail, VerifyEmail, PasswordReset } from '../api/userApi';

type modalType = 'login' | 'signup' | 'recovery' | 'verity' | 'reset';
const UserModalForm = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<modalType>('login');
  const [isLoginHovered, setIsLoginHovered] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [kakaoEmail, setKakaoEmail] = useState<string>('');

  const switchView = (view: modalType) => {
    setActiveView(view);
  };

  const handleVerityEmail = async () => {
    if (email.trim() === '') return alert('메일을 입력해주세요');

    const res = await SendEmail(email);
    console.log(res)
    if (res && res.data && res.status === 201) {
      switchView('verity');
      alert('메일로 인증번호가 발송되었습니다.');
    } else {
      alert('존재하지 않는 이메일 입니다.');
    }
  };

  const handleSubmitVerify = async () => {
    if (verificationCode.trim() === '') return alert('메일을 입력해주세요');

    const res = await VerifyEmail(email);
    
    if (res && res.data && res.data.response.verification) {
      switchView('reset');
    } else {
      alert('인증에 실패 하였습니다.');
    }
  };

  const handlePasswordReset = () => {
    if (password.trim() === '' || confirmPassword.trim() === '')
      return alert('비밀번호를 입력해 주세요');
    if (password === confirmPassword) {
      const res = PasswordReset({ email, password });
      alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요');
      switchView('login');
    } else {
      return alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div style = {{textAlign: 'center'}}>
      <ButtonWrapper>
        <LoginButton
          onClick={() => {
            setModalIsOpen(true);
            setActiveView('login');
          }}
          isLoginHovered={isLoginHovered}
          onMouseEnter={() => setIsLoginHovered(true)}
          onMouseLeave={() => setIsLoginHovered(false)}
        >
          <span style={{ fontWeight: '10000' }}>Log In</span>
        </LoginButton>
      </ButtonWrapper>

      <Modal
        top={'20vh'}
        buttonLabel={activeView}
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
      >
        {activeView === 'login' && (
          <Login
            onSwitchView={switchView}
            modalIsOpen={setModalIsOpen}
            kakaoEmail={kakaoEmail}
            setKakaoEmail={setKakaoEmail}
          />
        )}

        {activeView === 'signup' && (
          <Signup
            onSwitchView={() => switchView('login')}
            modalIsOpen={setModalIsOpen}
            kakaoEmail={kakaoEmail}
          />
        )}

        {activeView === 'recovery' && (
          <PassWordReset
            title={'비밀번호 찾기'}
            body={
              <SubmitInput
                placeholder="이메일 *"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                type="email"
                id="email"
                name="email"
              />
            }
            footer={
              <>
                <SubmitButton
                  onClick={() => {
                    handleVerityEmail();
                  }}
                >
                  비밀번호 찾기
                </SubmitButton>
                <SwitchButton
                  onClick={() => {
                    switchView('login');
                  }}
                >
                  로그인으로 전환
                </SwitchButton>
              </>
            }
          />
        )}

        {activeView === 'verity' && (
          <PassWordReset
            title={'비밀번호 찾기'}
            body={
              <SubmitInput
                onChange={(event) => {
                  setVerificationCode(event.target.value);
                }}
                placeholder="인증번호"
                type="text"
                id="text"
                name="text"
              />
            }
            footer={
              <SubmitButton
                onClick={() => {
                  handleSubmitVerify();
                }}
              >
                확인
              </SubmitButton>
            }
          />
        )}

        {activeView === 'reset' && (
          <PassWordReset
            title={'비밀번호 재설정'}
            body={
              <>
                <SubmitInput
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  placeholder="비밀번호"
                  type="password"
                  id="password"
                  name="password"
                />

                <SubmitInput
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                  placeholder="비밀번호 확인"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                />
              </>
            }
            footer={
              <SubmitButton
                onClick={() => {
                  handlePasswordReset();
                }}
              >
                확인
              </SubmitButton>
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default UserModalForm;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
`;

const LoginButton = styled.button<{ readonly isLoginHovered: boolean }>`
  height: 50px;
  width: 80px;
  border: none;
  background-color: ${(props) =>
    props.isLoginHovered ? '#77C2E2' : '#84d7fb'};
  border-radius: 30px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-weight: 10000;
  }
`;

const SubmitInput = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 25px;
  margin-bottom: 10px;
  box-sizing: border-box;
  height: 35px;
`;

const SwitchButton = styled.button`
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  background-color: #000;
  color: white;
  cursor: pointer;
  width: 140px;
  height: 45px;

  &:hover {
    background-color: #333;
  }
`;

const SubmitButton = styled.button`
  width: 140px;
  height: 45px;
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  background-color: #84d7fb;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #72c2e9;
  }
`;
