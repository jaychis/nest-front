import React, { MouseEventHandler, useEffect, useState } from 'react';
import {
  ExistingEmailAPI,
  ExistingNicknameAPI,
  ExistingPhoneAPI,
  SignupAPI,
  SignupParams,
  LoginAPI,
  LoginParams,
} from '../api/UserApi';
import { CollectionTypes } from '../../_common/CollectionTypes';
import {
  isValidPasswordFormat,
  isValidPhoneNumber,
} from '../../_common/PasswordRegex';
import { FaGoogle, FaApple, FaComment } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import vLogo from '../../assets/img/v-check.png';
import xLogo from '../../assets/img/x-check.png';
import Alert from '../../components/Alert';

interface Props {
  readonly onSwitchView: () => void;
  readonly modalIsOpen: (state: boolean) => void; // Optional prop, not required for independent usage
}

interface ValidSignupType {
  readonly email: null | boolean;
  readonly phone: null | boolean;
  readonly nickname: null | boolean;
  readonly password?: false | boolean;
  readonly confirmPassword?: false | boolean;
}

const Signup = ({ onSwitchView, modalIsOpen }: Props) => {
  const [signup, setSignup] = useState<SignupParams>({
    email: '',
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
          if (res.status === 201 && response) {
            setShowAlert(true); // 알람 표시
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
  const KAKAO_CLIENT_ID = (() => {
    switch (process.env.REACT_APP_NODE_ENV) {
      case 'production':
        return process.env.REACT_APP_KAKAO_CLIENT_ID; // production 환경의 Client ID
      default:
        return process.env.REACT_APP_KAKAO_TEST_CLIENT_ID; // 기본값 또는 undefined 방지
    }
  })();
  const REDIRECT_URI =
    process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_KAKAO_REDIRECT_URL
      : process.env.REACT_APP_NODE_ENV === 'stage'
        ? process.env.REACT_APP_KAKAO_STAGE_REDIRECT_URL
        : process.env.REACT_APP_KAKAO_TEST_REDIRECT_URL;

  const kakaoOauthSignUp = () => {
    const currentUrl = window.location.href; // 현재 페이지의 경로
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=account_email&state=${encodeURIComponent(currentUrl)}`;

    const popup = window.open(
      KAKAO_AUTH_URL,
      'PopupWin',
      'width=500,height=600',
    );
    // 이벤트 리스너를 통해 팝업에서 인증 후 리디렉트된 URL의 코드를 받아 처리
    window.addEventListener(
      'message',
      async (event) => {
        try {
          const { user } = event.data; // 카카오로부터 받은 사용자 정보
          const parsedUser = JSON.parse(user); // 문자열로 온 경우 파싱

          console.log(`Received user info: ${JSON.stringify(parsedUser)}`);

          // 이메일, 닉네임, 전화번호를 기입할 수 있도록 상태 업데이트
          setSignup((prevSignup) => ({
            ...prevSignup,
            email: parsedUser.email || '',
            nickname: parsedUser.nickname || '',
            phone: parsedUser.phone || '',
          }));

          // 팝업이 열려 있으면 닫기
          if (popup) popup.close();
        } catch (error) {
          console.error(
            '카카오로부터 사용자 정보를 받아오는 데 실패했습니다.',
            error,
          );
          alert(
            '카카오로부터 사용자 정보를 받아오는 데 실패했습니다. 다시 시도해주세요.',
          );
        }
      },
      { once: true }, // 한 번만 실행되도록 설정
    );
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/*<button*/}
        {/*  style={styles.socialButton}*/}
        {/*  onClick={() => alert("Continue with Google")}*/}
        {/*>*/}
        {/*  <FaGoogle style={styles.socialLogo} />*/}
        {/*  구글로 가입*/}
        {/*</button>*/}
        {/*<button*/}
        {/*  style={styles.socialButton}*/}
        {/*  onClick={() => alert("Continue with Apple")}*/}
        {/*>*/}
        {/*  <FaApple style={styles.socialLogo} />*/}
        {/*  애플로 가입*/}
        {/*</button>*/}
        {/*<button*/}
        {/*  style={styles.socialButton}*/}
        {/*  onClick={() => alert("Continue with Naver")}*/}
        {/*>*/}
        {/*  <SiNaver style={styles.socialLogo} />*/}
        {/*  네이버로 가입*/}
        {/*</button>*/}
        <button style={styles.socialButton} onClick={() => kakaoOauthSignUp()}>
          <FaComment style={styles.socialLogo} />
          카카오로 가입
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          color: '#aaa',
          margin: '20px 0',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: '#aaa' }}></div>
        <div style={{ margin: '0 10px' }}>OR</div>
        <div style={{ flex: 1, height: '1px', background: '#aaa' }}></div>
      </div>

      <form>
        <div
          style={{
            position: 'relative',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          <input
            style={styles.input}
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
            <img
              src={vLogo}
              alt={'v logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '10px',
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
                right: '10px',
                top: '50%',
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
                right: '10px',
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
                right: '10px',
                top: '50%',
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
          {validPassword ? (
            <img
              src={vLogo}
              alt={'v logo'}
              style={{
                width: '20px',
                height: '20px',
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          ) : null}
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
                right: '10px',
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
                right: '10px',
                top: '50%',
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
    width: '100%',
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
