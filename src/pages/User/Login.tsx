import React, { MouseEventHandler, useState } from "react";
import { LoginAPI, LoginParams } from "../api/UserApi";
import { CollectionTypes } from "../../_common/CollectionTypes";
import { isValidPasswordFormat } from "../../_common/PasswordRegex";
import { FaGoogle, FaApple, FaComment } from "react-icons/fa";
import { SiNaver } from "react-icons/si";

interface Props {
  readonly onSwitchView: () => void;
  readonly modalIsOpen: (state: boolean) => void;
}

const Login = ({ onSwitchView, modalIsOpen }: Props) => {
  const [login, setLogin] = useState<LoginParams>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (event: CollectionTypes): void => {
    const { name, value } = event;

    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    const isPasswordValid: boolean = isValidPasswordFormat(login.password);
    const isEmailValid: boolean = /\S+@\S+\.\S+/.test(login.email);
    if (!isEmailValid) {
      setErrorMessage("유효한 이메일 주소를 입력하세요.");
      return;
    }

    if (isPasswordValid) {
      LoginAPI(login)
        .then((res): void => {
          const response = res.data.response;
          console.log("response ", response);

          if (res.status === 201 && response) {
            modalIsOpen(false);
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            localStorage.setItem("id", response.id);
            localStorage.setItem("nickname", response.nickname);
            window.location.reload();
          }
        })
        .catch((err): void => {
          setErrorMessage("로그인 실패. 이메일과 비밀번호를 확인하세요.");
          console.error(err);
        });
    } else {
      setErrorMessage(
        "비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다."
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>로그인</h2>
      </div>
      <div style={styles.socialButtonsContainer}>
        <button style={styles.socialButton} onClick={() => alert("Continue with Google")}>
          <FaGoogle style={styles.socialLogo} />
          구글로 로그인
        </button>
        <button style={styles.socialButton} onClick={() => alert("Continue with Apple")}>
          <FaApple style={styles.socialLogo} />
          애플로 로그인
        </button>
        <button style={styles.socialButton} onClick={() => alert("Continue with Naver")}>
          <SiNaver style={styles.socialLogo} />
          네이버로 로그인
        </button>
        <button style={styles.socialButton} onClick={() => alert("Continue with Kakao")}>
          <FaComment style={styles.socialLogo} />
          카카오로 로그인
        </button>
      </div>
      <div style={styles.orContainer}>
        <div style={styles.orLine}></div>
        <div style={styles.orText}>OR</div>
        <div style={styles.orLine}></div>
      </div>
      <form>
        <input
          style={styles.input}
          placeholder="이메일 *"
          type="email"
          id="email"
          name="email"
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
          onChange={(value) =>
            handleChange({
              name: value.target.name,
              value: value.target.value,
            })
          }
          placeholder="비밀번호 *"
          type="password"
          id="password"
          name="password"
          required
        />
        {errorMessage && <div style={styles.errorText}>{errorMessage}</div>}
        <div style={styles.forgotPasswordContainer}>
          <a href="/forgot-password" style={styles.forgotPasswordLink}>
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </form>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "-25px" }}>
        <button onClick={onSwitchView} style={styles.switchButton}>
          회원가입
        </button>
      </div>
      <div style={{ width: "100%", padding: "10px 0", textAlign: "center" }}>
        <button type="submit" style={styles.submitButton} onClick={handleSubmit}>
          로그인
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "25px",
    padding: "20px",
    minWidth: "400px",
    maxWidth: "600px",
    width: "80%",
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "space-between",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "736px", // 높이를 회원가입과 맞춤
  },
  header: {
    textAlign: "center" as "center",
    marginBottom: "20px",
  },
  socialButtonsContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    gap: "10px",
  },
  socialButton: {
    display: "flex",
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
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
  orContainer: {
    display: "flex",
    alignItems: "center" as "center",
    textAlign: "center" as "center",
    color: "#aaa",
    margin: "20px 0",
  },
  orLine: {
    flex: 1,
    height: "1px",
    background: "#aaa",
  },
  orText: {
    margin: "0 10px",
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
  forgotPasswordContainer: {
    width: "100%",
    padding: "10px 0",
    textAlign: "right" as "right",
  },
  forgotPasswordLink: {
    fontSize: "14px",
    color: "#007BFF",
  },
  submitContainer: {
    display: "flex",
    justifyContent: "center" as "center",
    marginTop: "20px",
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
  switchContainer: {
    width: "100%",
    padding: "10px 0",
    textAlign: "center" as "center",
  },
  switchButton: {
    padding: "10px 20px",
    width: "200px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "red",
    color: "white",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    textAlign: "center" as "center",
    marginTop: "10px",
    marginBottom: "10px",
  },
};

export default Login;
