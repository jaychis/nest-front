import React, { MouseEventHandler, useEffect, useState } from 'react';
import {
  ExistingEmailAPI,
  ExistingNicknameAPI,
  ExistingPhoneAPI,
  SignupAPI,
  SignupParams,
  LoginAPI,
} from '../api/userApi';
import { CollectionTypes } from '../../_common/collectionTypes';
import {
  isValidPasswordFormat,
  isValidPhoneNumber,
} from '../../_common/passwordRegex';
import VIcon from '../../assets/img/vicon.webp';
import XICon from '../../assets/img/vicon.webp';
import Alert from '../../components/Alert';
import styled from 'styled-components';

interface Props {
  readonly onSwitchView: () => void;
  readonly modalIsOpen: (state: boolean) => void;
  readonly kakaoEmail: string;
}

interface ValidSignupType {
  readonly email: null | boolean;
  readonly phone: null | boolean;
  readonly nickname: null | boolean;
  readonly password?: false | boolean;
  readonly confirmPassword?: false | boolean;
}

const Signup = ({ onSwitchView, modalIsOpen, kakaoEmail }: Props) => {
  const [signup, setSignup] = useState<SignupParams>({
    email: kakaoEmail
      ? kakaoEmail
      : localStorage.getItem('email')
        ? (localStorage.getItem('email') as string)
        : '',
    nickname: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [validSignup, setValidSignup] = useState<ValidSignupType>({
    email: null,
    phone: null,
    nickname: null,
  });

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

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);

  useEffect(() => {
    if (signup.email.length >= 12) {
      const timeOutEmail: NodeJS.Timeout = setTimeout(() => {
        const email: string = signup.email as string;
        ExistingEmailAPI({ email })
          .then((res) => {
            const response = res.data.response?.existing_email;
            setValidSignup({
              ...validSignup,
              email: response,
            });
          })
          .catch((err) => console.error(err));
      }, 1000); // 1000ms
      return () => clearTimeout(timeOutEmail);
    }
  }, [signup.email]);

  useEffect(() => {
    if (signup.nickname.length >= 3) {
      const timeOutNickname: NodeJS.Timeout = setTimeout(() => {
        const nickname: string = signup.nickname as string;
        ExistingNicknameAPI({ nickname })
          .then((res) => {
            const response = res.data.response?.existing_nickname;

            setValidSignup({
              ...validSignup,
              nickname: response,
            });
          })
          .catch((err) => console.error(err));
      }, 1000);

      return () => clearTimeout(timeOutNickname);
    }
  }, [signup.nickname]);

  useEffect(() => {
    if (signup.phone.length >= 11) {
      const timeOutPhone: NodeJS.Timeout = setTimeout(() => {
        const phone: string = signup.phone as string;
        ExistingPhoneAPI({ phone })
          .then((res) => {
            const response = res.data.response?.existing_phone;

            setValidSignup({
              ...validSignup,
              phone: response,
            });
          })
          .catch((err) => console.error(err));
      }, 1000);
      return () => clearTimeout(timeOutPhone);
    }
  }, [signup.phone]);

  useEffect(() => {
    if (
      signup.password.length > 7 &&
      signup.password === signup.confirmPassword
    ) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [signup.confirmPassword, signup.password]);

  const handleChange = (event: CollectionTypes) => {
    const { name, value } = event;

    setSignup({
      ...signup,
      [name]: value,
    });
  };

  const processLogin = async () => {
    try {
      const login = { email: signup.email, password: signup.password };
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (event) event.preventDefault();

    if (
      !signup.email ||
      !signup.nickname ||
      !signup.password ||
      !signup.confirmPassword ||
      !signup.phone
    ) {
      return alert('모든 정보를 입력해주세요');
    }

    if (!isValidPhoneNumber(signup.phone))
      return alert('핸드폰 번호를 확인 해주세요');

    const isPasswordValid: boolean = isValidPasswordFormat(signup.password);
    const isConfirmPasswordValid: boolean = isValidPasswordFormat(
      signup.confirmPassword,
    );

    if (isPasswordValid && isConfirmPasswordValid) {
      SignupAPI(signup)
        .then((res): void => {
          const response = res.data.response;
          localStorage.removeItem('email');

          if (res.status === 201 && response) {
            setShowAlert(true);
            processLogin();
            if (modalIsOpen) modalIsOpen(false);
          }
        })
        .catch((err): void => console.error(err));
    } else {
      alert(
        '비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다.',
      );
    }
  };

  return (
    <Container>
      {showAlert && (
        <Alert
          message="회원가입이 완료되었습니다."
          onClose={() => setShowAlert(false)}
          type="success"
        />
      )}
      <Title>
        <h2>회원가입</h2>
      </Title>
      <form>
        <InputWrapper>
          <Input
            placeholder="이메일 *"
            type="email"
            id="email"
            name="email"
            data-testid="email-input"
            value={signup.email}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validSignup.email !== null && (
            <ValidationLogo
              src={validSignup.email ? VIcon : XICon}
              alt="validation logo"
            />
          )}
        </InputWrapper>

        <InputWrapper>
          <Input
            placeholder="닉네임 *"
            type="text"
            id="nickname"
            name="nickname"
            data-testid="nickname-input"
            value={signup.nickname}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validSignup.nickname !== null && (
            <ValidationLogo
              src={validSignup.nickname ? VIcon : XICon}
              alt="validation logo"
            />
          )}
        </InputWrapper>

        <InputWrapper>
          <Input
            placeholder="비밀번호 *"
            type="password"
            id="password"
            name="password"
            data-testid="password-input"
            value={signup.password}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            placeholder="비밀번호 확인 *"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            data-testid="confirmPassword-input"
            value={signup.confirmPassword}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validPassword && (
            <ValidationLogo src={VIcon} alt="validation logo" />
          )}
          {!validPassword && signup.confirmPassword.length > 0 && (
            <ValidationLogo src={XICon} alt="validation logo" />
          )}
        </InputWrapper>

        <InputWrapper>
          <Input
            placeholder="전화번호 *"
            type="text"
            id="phone"
            name="phone"
            data-testid="phoneNumber-input"
            value={signup.phone}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validSignup.phone !== null && (
            <ValidationLogo
              src={validSignup.phone ? VIcon : XICon}
              alt="validation logo"
            />
          )}
        </InputWrapper>
      </form>

      <ButtonWrapper>
        <SubmitButton data-testid = 'submit-button' type="submit" onClick={handleSubmit}>
          회원가입
        </SubmitButton>
      </ButtonWrapper>

      <SwitchButtonWrapper>
        <SwitchButton onClick={onSwitchView}>로그인으로 전환</SwitchButton>
      </SwitchButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  background-color: #fff;
  border-radius: 25px;
  padding: 15px;
  box-sizing: border-box;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
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

const ValidationLogo = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const ButtonWrapper = styled.div`
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

const SwitchButtonWrapper = styled.div`
  width: 100%;
  padding: 10px 0;
  text-align: center;
`;

const SwitchButton = styled.button`
  padding: 10px 20px;
  width: 200px;
  border-radius: 25px;
  border: none;
  background-color: #000;
  color: white;
  cursor: pointer;
`;

export default Signup;
