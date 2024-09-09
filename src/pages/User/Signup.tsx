import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  ExistingEmailAPI,
  ExistingNicknameAPI,
  ExistingPhoneAPI,
  SignupAPI,
  SignupParams,
} from "../api/UserApi";
import { CollectionTypes } from "../../_common/CollectionTypes";
import { isValidPasswordFormat } from "../../_common/PasswordRegex";
import { FaGoogle, FaApple, FaComment } from "react-icons/fa";
import { SiNaver } from "react-icons/si";
import vLogo from "../../assets/img/v-check.png";
import xLogo from "../../assets/img/x-check.png";
import Alert from "../../components/Alert";

interface Props {
  readonly onSwitchView: () => void;
  readonly modalIsOpen?: (state: boolean) => void; // Optional prop, not required for independent usage
}

interface ValidSignupType {
  readonly email: null | boolean;
  readonly phone: null | boolean;
  readonly nickname: null | boolean;
}

const Signup = ({ onSwitchView, modalIsOpen }: Props) => {
  const [signup, setSignup] = useState<SignupParams>({
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [validSignup, setValidSignup] = useState<ValidSignupType>({
    email: null,
    phone: null,
    nickname: null,
  });

  const [showAlert, setShowAlert] = useState<boolean>(false);

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

  const handleChange = (event: CollectionTypes) => {
    const { name, value } = event;

    setSignup({
      ...signup,
      [name]: value,
    });
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (event) event.preventDefault();

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
            if (modalIsOpen) modalIsOpen(false);
          }
        })
        .catch((err): void => console.error(err));
    } else {
      alert(
        "비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다.",
      );
    }
  };

  const KAKAO_CLIENT_ID = '026c54fa1a5db9470f3de31c6951c6df';
  const REDIRECT_URI = 'http://127.0.0.1:9898/users/kakao/callback';
  // const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  // const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

  const kakaoOauthSignUp = () => {
    const popup = window.open(
      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=account_email`,
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
            email: parsedUser.email || "",
            nickname: parsedUser.nickname || "",
            phone: parsedUser.phone || "",
          }));

          // 팝업이 열려 있으면 닫기
          if (popup) popup.close();
        } catch (error) {
          console.error("카카오로부터 사용자 정보를 받아오는 데 실패했습니다.", error);
          alert("카카오로부터 사용자 정보를 받아오는 데 실패했습니다. 다시 시도해주세요.");
        }
      },
      { once: true }, // 한 번만 실행되도록 설정
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "25px",
        padding: "25px",
        minWidth: "400px",
        maxWidth: "600px",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {showAlert && (
        <Alert message="회원가입이 완료되었습니다." onClose={() => setShowAlert(false)} type="success" />
      )}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>회원가입</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          style={styles.socialButton}
          onClick={() => alert("Continue with Google")}
        >
          <FaGoogle style={styles.socialLogo} />
          구글로 가입
        </button>
        <button
          style={styles.socialButton}
          onClick={() => alert("Continue with Apple")}
        >
          <FaApple style={styles.socialLogo} />
          애플로 가입
        </button>
        <button
          style={styles.socialButton}
          onClick={() => alert("Continue with Naver")}
        >
          <SiNaver style={styles.socialLogo} />
          네이버로 가입
        </button>
        <button
          style={styles.socialButton}
          onClick={() => kakaoOauthSignUp()}
        >
          <FaComment style={styles.socialLogo} />
          카카오로 가입
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          color: "#aaa",
          margin: "20px 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "#aaa" }}></div>
        <div style={{ margin: "0 10px" }}>OR</div>
        <div style={{ flex: 1, height: "1px", background: "#aaa" }}></div>
      </div>

      <form>
        <div
          style={{
            position: "relative",
            width: "100%",
            marginBottom: "10px",
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
              alt={"v logo"}
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          ) : (
            <img
              src={xLogo}
              alt={"x logo"}
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            marginBottom: "10px",
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
          {validSignup.nickname === null ? null : validSignup.nickname === true ? (
            <img
              src={vLogo}
              alt={"v logo"}
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          ) : (
            <img
              src={xLogo}
              alt={"x logo"}
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>

        <input
          style={styles.input}
          placeholder="비밀번호 *"
          type="password"
          id="password"
          name="password"
          onChange={(value) =>
            handleChange({
              name: value.target.name,
              value: value.target.value,
            })
          }
          required
        />

        <input
          style={styles.input}
          placeholder="비밀번호 확인 *"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          onChange={(value) =>
            handleChange({
              name: value.target.name,
              value: value.target.value,
            })
          }
          required
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            marginBottom: "10px",
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
              alt={"v logo"}
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          ) : (
            <img
              src={xLogo}
              alt={"x logo"}
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </div>
      </form>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <button
          type="submit"
          style={styles.submitButton}
          onClick={handleSubmit}
        >
          회원가입
        </button>
      </div>
      <div style={{ width: "100%", padding: "10px 0", textAlign: "center" }}>
        <button onClick={onSwitchView} style={styles.switchButton}>
          로그인으로 전환
        </button>
      </div>
    </div>
  );
};

const styles = {
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    borderRadius: "10px",
    cursor: "pointer",
    height: "40px",
  },
  socialLogo: {
    width: "20px",
    height: "20px",
    marginRight: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "10px",
    boxSizing: "border-box" as "border-box",
    width: "100%",
    height: "40px",
  },
  submitButton: {
    padding: "10px 20px",
    width: "200px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#84d7fb",
    color: "white",
    cursor: "pointer",
  },
  switchButton: {
    padding: "10px 20px",
    width: "200px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#000",
    color: "white",
    cursor: "pointer",
  },
};

export default Signup;
