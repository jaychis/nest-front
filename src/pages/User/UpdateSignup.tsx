import React, { MouseEventHandler, useEffect, useState } from 'react';
import {
  ExistingEmailAPI,
  ExistingNicknameAPI,
  ExistingPhoneAPI,
  SignupAPI,
  SignupParams,
  LoginAPI,
  UsersVerifyEmailAPI,
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
import { Input } from 'antd';
import { VerifyEmail } from '../api/userApi';

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

const UpdateSignup = ({ onSwitchView, modalIsOpen, kakaoEmail }: Props) => {
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
  const [showEmailVerification, setShowEmailVerification] =
    useState<boolean>(false);
  const [verificationCodeCheck, setVerificationCodeCheck] =
    useState<boolean>(false);
  const [verificationCodeComparison, setVerificationCodeComparison] =
    useState<string>('');
  const [inputVerificationCodeComparison, setInputVerificationCodeComparison] =
    useState<string>('');
  const [emailCode, setEmailCode] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);

  const sendEmailVerificationHandler = async (email: string) => {
    if (!email) return alert('이메일을 입력해주세요');
    const res = await VerifyEmail(email);
    alert('전송되었습니다.');
    setVerificationCode(res?.data.response.verification_code);
  };

  const codeVerifyHandler = async (emailCode: string) => {
    if (!emailCode) return alert('인증번호를 입력해주세요');

    if (emailCode.trim() === verificationCode) {
      setVerifyEmail(true);
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

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

  const handleEmailVerification = async () => {
    if (!validSignup.email) return alert('사용할 수 없는 이메일 입니다.');
    else alert('메일이 전송되었습니다.');

    const response = await UsersVerifyEmailAPI({ email: signup.email });
    if (!response) return;

    const emailCode: string = response.data.response?.verification_code;
    console.log('emailCode : ', emailCode);
    setVerificationCodeCheck(true);
    setVerificationCodeComparison(emailCode);
  };

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

  const verificationCodeHandleChange = (event: CollectionTypes) => {
    const { value } = event;

    setInputVerificationCodeComparison(value);
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

    if (!finalVerificationCodeCheck)
      return alert('이메일 인증을 진행해주세요.');

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

  const [finalVerificationCodeCheck, setFinalVerificationCodeCheck] =
    useState<boolean>(false);
  const compareVerificationCodes = async () => {
    if (verificationCodeComparison === inputVerificationCodeComparison) {
      alert('인증이 완료 되었습니다.');
      setFinalVerificationCodeCheck(true);
    } else alert('번호가 일치하지 않습니다.');
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
      <Title>
        <h2>회원가입</h2>
      </Title>

      <InputContainer>
        <StyledInput
          width={'55%'}
          placeholder="이메일 *"
          type="email"
          id="email"
          name="email"
          disabled={finalVerificationCodeCheck}
          value={signup.email}
          onChange={(value) =>
            handleChange({
              name: value.target.name,
              value: value.target.value,
            })
          }
          required
        />
        <VerificationButton
          onClick={handleEmailVerification}
          disabled={finalVerificationCodeCheck}
        >
          이메일 인증
        </VerificationButton>

        {validSignup.email === null ? null : validSignup.email === true ? (
          <Icon right={'41%'} src={vLogo} alt={'v logo'} />
        ) : (
          <Icon right={'41%'} src={xLogo} alt={'x logo'} />
        )}
      </InputContainer>

      <InputContainer>
        <StyledInput
          width={'55%'}
          placeholder="인증번호 *"
          onChange={(value) =>
            verificationCodeHandleChange({
              name: value.target.name,
              value: value.target.value,
            })
          }
        />
        <VerificationButton onClick={compareVerificationCodes}>
          인증번호 확인
        </VerificationButton>
      </InputContainer>

      <InputContainer>
        <StyledInput
          width={'95%'}
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
          <Icon right={'10px'} src={vLogo} alt={'v logo'} />
        ) : (
          <Icon right={'10px'} src={xLogo} alt={'x logo'} />
        )}
      </InputContainer>

      <InputContainer>
        <StyledInput
          width={'95%'}
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
          width={'95%'}
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

        {validPassword && <Icon right={'10px'} src={vLogo} alt={'v logo'} />}

        {!validPassword && signup.confirmPassword.length > 0 && (
          <Icon right={'10px'} src={xLogo} alt={'x logo'} />
        )}
      </InputContainer>

      <InputContainer>
        <StyledInput
          width={'95%'}
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
          <Icon right={'10px'} src={vLogo} alt={'v logo'} />
        ) : (
          <Icon right={'10px'} src={xLogo} alt={'x logo'} />
        )}
      </InputContainer>

      <ButtonContainer>
        <Button type="submit" onClick={handleSubmit}>
          회원가입
        </Button>
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

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const StyledInput = styled.input<{ width: string }>`
  width: ${(props) => props.width};
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

const VerificationButton = styled.button`
  padding: 10px 20px;
  width: 35%;
  border-radius: 5px;
  border: none;
  background-color: #84d7fb;
  color: white;
  cursor: pointer;
`;

const Icon = styled.img<{ right: string }>`
  width: 20px;
  height: 20px;
  position: absolute;
  right: ${(props) => props.right};
  top: 50%;
  transform: translateY(-50%);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
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

export default UpdateSignup;
