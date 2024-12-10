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
  const [showEmailVerification, setShowEmailVerification] =
    useState<boolean>(false);
  const [verificationCodeCheck, setVerificationCodeCheck] =
    useState<boolean>(false);
  const [verificationCodeComparison, setVerificationCodeComparison] =
    useState<string>('');
  const [inputVerificationCodeComparison, setInputVerificationCodeComparison] =
    useState<string>('');

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
            setShowEmailVerification(response === true);
          })
          .catch((err) => console.error(err));
      }, 1000); // 1000ms
      return () => clearTimeout(timeOutEmail);
    }
  }, [signup.email]);

  const handleEmailVerification = async () => {
    alert('Email verification process initiated.');

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
    console.log('verificationCodeComparison : ', verificationCodeComparison);
    console.log(
      'inputVerificationCodeComparison : ',
      inputVerificationCodeComparison,
    );
    if (verificationCodeComparison === inputVerificationCodeComparison) {
      alert('동일');
      setFinalVerificationCodeCheck(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '25px',
        padding: '25px',
        minWidth: '400px',
        maxWidth: '600px',
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {showAlert && (
        <Alert
          message="회원가입이 완료되었습니다."
          onClose={() => setShowAlert(false)}
          type="success"
        />
      )}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>회원가입</h2>
      </div>

      <form>
        <div
          style={{
            position: 'relative',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <input
              style={{
                width: showEmailVerification ? '60%' : '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginRight: '10px',
              }}
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

            {showEmailVerification && (
              <>
                <button
                  onClick={handleEmailVerification}
                  disabled={finalVerificationCodeCheck}
                  style={{
                    padding: '10px 20px',
                    width: '40%',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#84d7fb',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  이메일 인증
                </button>
              </>
            )}
          </div>

          {validSignup.email === null ? null : validSignup.email === true ? (
            <img
              src={vLogo}
              alt={'v logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '165px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          ) : (
            <img
              src={xLogo}
              alt={'x logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '17px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </div>

        {verificationCodeCheck && (
          <>
            <div
              style={{
                position: 'relative',
                width: '100%',
                marginBottom: '10px',
              }}
            >
              <div
                style={{ width: '100%', display: 'flex', alignItems: 'center' }}
              >
                <input
                  style={{
                    width: '60%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginRight: '10px',
                  }}
                  onChange={(value) =>
                    verificationCodeHandleChange({
                      name: value.target.name,
                      value: value.target.value,
                    })
                  }
                />
                <button
                  onClick={compareVerificationCodes}
                  style={{
                    padding: '10px 20px',
                    width: '40%',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#84d7fb',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  인증번호 확인
                </button>
              </div>
            </div>
          </>
        )}
        <div
          style={{
            position: 'relative',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <input
            style={styles.input}
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
            <img
              src={vLogo}
              alt={'v logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '17px',
                top: '40%',
                transform: 'translateY(-50%)',
              }}
            />
          ) : (
            <img
              src={xLogo}
              alt={'x logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '17px',
                top: '40%',
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <input
            style={styles.input}
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
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <input
            style={styles.input}
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

          {validPassword && (
            <img
              src={vLogo}
              alt={'v logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '17px',
                top: '40%',
                transform: 'translateY(-50%)',
              }}
            />
          )}

          {!validPassword && signup.confirmPassword.length > 0 && (
            <img
              src={xLogo}
              alt={'x logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '17px',
                top: '40%',
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <input
            style={styles.input}
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
            <img
              src={vLogo}
              alt={'v logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '17px',
                top: '40%',
                transform: 'translateY(-50%)',
              }}
            />
          ) : (
            <img
              src={xLogo}
              alt={'x logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '17px',
                top: '40%',
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </div>
      </form>

      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <button
          type="submit"
          style={styles.submitButton}
          onClick={handleSubmit}
        >
          회원가입
        </button>
      </div>
      <div style={{ width: '100%', padding: '10px 0', textAlign: 'center' }}>
        <button onClick={onSwitchView} style={styles.switchButton}>
          로그인으로 전환
        </button>
      </div>
    </div>
  );
};

const styles = {
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    borderRadius: '10px',
    cursor: 'pointer',
    height: '40px',
  },
  socialLogo: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
    boxSizing: 'border-box' as 'border-box',
    width: '97%',
    height: '40px',
  },
  submitButton: {
    padding: '10px 20px',
    width: '200px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#84d7fb',
    color: 'white',
    cursor: 'pointer',
  },
  switchButton: {
    padding: '10px 20px',
    width: '200px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#000',
    color: 'white',
    cursor: 'pointer',
  },
};

export default Signup;
