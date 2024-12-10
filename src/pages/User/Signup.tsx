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
import { FaComment } from 'react-icons/fa';
import vLogo from '../../assets/img/v-check.png';
import xLogo from '../../assets/img/x-check.png';
import Alert from '../../components/Alert';
import styled from 'styled-components';
import { SendEmail, VerifyEmail } from '../api/userApi';

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
  const [emailCode, setEmailCode] = useState<string>('')
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  
  const sendEmailVerificationHandler = async (email:string) => {
    if(!email) return alert('이메일을 입력해주세요')
    await SendEmail(email)
    alert('전송되었습니다.')
  }

  const codeVerifyHandler = async (email: string, verificationCode:string) => {
    if(!emailCode) return alert('인증번호를 입력해주세요')
    
    const res = await VerifyEmail({email, verificationCode})

    if(res && res.data && res.data.response.verification){
      setVerifyEmail(true)
    }
    else{alert('인증번호가 일치하지 않습니다.')}
  }

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
    <SignUpContainer>
      {showAlert && (
        <AlertContainer>
          <Alert
            message="회원가입이 완료되었습니다."
            onClose={() => setShowAlert(false)}
            type="success"
          />
        </AlertContainer>
      )}
      <TitleContainer>
        <h2>회원가입</h2>
      </TitleContainer>

        <InputContainer>
          <StyledInput
            placeholder="이메일 *"
            type="email"
            id="email"
            name="email"
            value={signup.email}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validSignup.email === null ? null : validSignup.email === true ? (
            <Icon src={vLogo} alt="v logo" />
          ) : (
            <Icon src={xLogo} alt="x logo" />
          )}
        </InputContainer>
        
        {!verifyEmail ?
         <InputContainer>
         <StyledInput
          style = {{width: '50%'}}
           placeholder="인증 코드*"
           type='text'
           value={emailCode}
           onChange={(value) => setEmailCode(value.target.value)}
         />
         <SubmitButton onClick = {() => {sendEmailVerificationHandler(signup.email)}} style = {{width: '35%', marginLeft: '2vw'}}>이메일로 받기</SubmitButton>
        </InputContainer>
        :
        <>
          <InputContainer>
          <StyledInput
            placeholder="닉네임 *"
            type="text"
            id="nickname"
            name="nickname"
            value={signup.nickname}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validSignup.nickname === null ? null : validSignup.nickname ===
            true ? (
            <Icon src={vLogo} alt="v logo" />
          ) : (
            <Icon src={xLogo} alt="x logo" />
          )}
        </InputContainer>

        <InputContainer>
          <StyledInput
            placeholder="비밀번호 *"
            type="password"
            id="password"
            name="password"
            value={signup.password}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
        </InputContainer>

        <InputContainer>
          <StyledInput
            placeholder="비밀번호 확인 *"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={signup.confirmPassword}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validPassword && <Icon src={vLogo} alt="v logo" />}
          {!validPassword && signup.confirmPassword.length > 0 && (
            <Icon src={xLogo} alt="x logo" />
          )}
        </InputContainer>

        <InputContainer>
          <StyledInput
            placeholder="전화번호 *"
            type="text"
            id="phone"
            name="phone"
            value={signup.phone}
            onChange={(value) =>
              handleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
            required
          />
          {validSignup.phone === null ? null : validSignup.phone === true ? (
            <Icon src={vLogo} alt="v logo" />
          ) : (
            <Icon src={xLogo} alt="x logo" />
          )}
        </InputContainer>
         </>
        }

      <ButtonContainer>
        {!verifyEmail ?
        <SubmitButton type="submit" onClick={() => {codeVerifyHandler(signup.email,emailCode.trim())}}>
          확인
        </SubmitButton> :
        <SubmitButton type="submit" onClick={handleSubmit}>
          회원가입
        </SubmitButton>
        }
        
      </ButtonContainer>

      <SwitchButtonContainer>
        <SwitchButton onClick={onSwitchView}>로그인으로 전환</SwitchButton>
      </SwitchButtonContainer>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  background-color: #fff;
  border-radius: 25px;
  padding: 25px;
  min-width: 400px;
  max-width: 600px;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const ButtonContainer = styled.div`
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

const SwitchButtonContainer = styled.div`
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

const AlertContainer = styled.div`
  margin-bottom: 20px;
`;

export default Signup;
