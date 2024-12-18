import './UserModalForm.css';
import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Login from './Login';
import Signup from './Signup';
import PassWordReset from '../../components/PasswordReset';
import styled from 'styled-components';
import {
  SendEmail,
  VerifyEmail,
  PasswordReset,
  PasswordResetParams,
} from '../api/userApi';

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
  const [adminButtonCount, setAdminButtonCount] = useState<number>(0);

  const switchView = (view: modalType) => {
    setActiveView(view);
  };

  const handleVerityEmail = async () => {
    if (email.trim() === '') return alert('메일을 입력해주세요');

    const res = await SendEmail(email);
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
    <>
      <div
        className="modalContainer"
        style={{
          marginRight: '30px',
          // marginLeft: "5px",
          width: '70px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center', // 가로 중앙 정렬
          alignItems: 'center', // 세로 중앙 정렬
          borderRadius: '30px',
        }}
      >
        <button
          onClick={() => {
            setModalIsOpen(true);
            setActiveView('login');
          }}
          style={{
            height: '100%',
            width: '100%',
            border: 'none',
            backgroundColor: isLoginHovered ? '#77C2E2' : '#84d7fb',
            borderRadius: '30px',
            fontWeight: 'bold',
            color: 'white',
          }}
          className="my-component"
          onMouseEnter={() => setIsLoginHovered(true)}
          onMouseLeave={() => setIsLoginHovered(false)}
        >
          <span style={{ fontWeight: '10000' }}>Log In</span>
        </button>
      </div>

      <Modal
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
            onSwitchView={switchView}
            modalIsOpen={setModalIsOpen}
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
            onSwitchView={switchView}
            modalIsOpen={setModalIsOpen}
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
            onSwitchView={switchView}
            modalIsOpen={setModalIsOpen}
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
    </>
  );
};

export default UserModalForm;

const SubmitInput = styled.input`
  min-width: 400px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
  height: 40px;
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
    background-color: #333;
`;

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
