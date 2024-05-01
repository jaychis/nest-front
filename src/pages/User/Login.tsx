import React, { MouseEventHandler, useState } from "react";
import { LoginAPI, LoginParams } from "../api/UserApi";
import { HandleChangeType } from "../../_common/HandleChangeType";
import { isValidPasswordFormat } from "../../_common/PasswordRegex";

interface Props {
  readonly onSwitchView: () => void;
  readonly modalIsOpen: (state: boolean) => void;
}
const Login = ({ onSwitchView, modalIsOpen }: Props) => {
  const [login, setLogin] = useState<LoginParams>({
    email: "",
    password: "",
  });

  const handleChange = (event: HandleChangeType): void => {
    const { name, value } = event;

    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    const isPasswordValid: boolean = isValidPasswordFormat(login.password);
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
        .catch((err): void => console.error(err));
    } else {
      alert(
        "비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다.",
      );
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "25px",
              padding: "25px",
              minWidth: "80vh",
              minHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", height: "20%" }}>
              <button
                style={{
                  alignSelf: "flex-end",
                  padding: "20px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "35px",
                  cursor: "pointer",
                  marginLeft: "auto",
                  marginRight: "10px",
                }}
                onClick={() => {
                  console.log("close click");
                  modalIsOpen(false);
                }}
              >
                Close
              </button>
            </div>
            <div
              style={{
                display: "flex",
                height: "70vh",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: "100%",
                }}
              >
                <h2 style={{ textAlign: "center" }}>Login</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    margin: "20px 0",
                  }}
                >
                  <button
                    style={{
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      minWidth: "100px",
                      width: "100%",
                      borderRadius: "10px",
                      cursor: "pointer",
                      height: "4vh",
                    }}
                    onClick={() => alert("Continue with Google")}
                  >
                    Continue with Google
                  </button>
                  <button
                    style={{
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      minWidth: "100px",
                      width: "100%",
                      borderRadius: "10px",
                      cursor: "pointer",
                      height: "4vh",
                    }}
                    onClick={() => alert("Continue with Apple")}
                  >
                    Continue with Apple
                  </button>
                  <button
                    style={{
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      minWidth: "100px",
                      width: "100%",
                      borderRadius: "10px",
                      cursor: "pointer",
                      height: "4vh",
                    }}
                    onClick={() => alert("Continue with Naver")}
                  >
                    Continue with Naver
                  </button>
                  <button
                    style={{
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      minWidth: "100px",
                      width: "100%",
                      borderRadius: "10px",
                      cursor: "pointer",
                      height: "4vh",
                    }}
                    onClick={() => alert("Continue with Kakao")}
                  >
                    Continue with Kakao
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
                  <div
                    style={{ flex: 1, height: "1px", background: "#aaa" }}
                  ></div>
                  <div
                    style={{
                      margin: "10px 10px",
                    }}
                  >
                    OR
                  </div>
                  <div
                    style={{ flex: 1, height: "1px", background: "#aaa" }}
                  ></div>
                </div>

                <form>
                  <input
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      marginBottom: "10px",
                      boxSizing: "border-box",
                      width: "100%",
                      height: "4vh",
                    }}
                    placeholder="Email *"
                    type="email"
                    id="email"
                    name={"email"}
                    onChange={(value) =>
                      handleChange({
                        name: value.target.name,
                        value: value.target.value,
                      })
                    }
                    required
                  />

                  <input
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      marginBottom: "10px",
                      boxSizing: "border-box",
                      height: "4vh",
                    }}
                    onChange={(value) =>
                      handleChange({
                        name: value.target.name,
                        value: value.target.value,
                      })
                    }
                    placeholder="Password *"
                    type="password"
                    id="password"
                    name={"password"}
                    required
                  />

                  <div
                    style={{
                      width: "100%",
                      padding: "10px 0",
                    }}
                  >
                    <a href="/forgot-password" style={{ fontSize: "20px" }}>
                      Forgot password?
                    </a>
                  </div>
                </form>
                <div style={{ width: "100%", padding: "10px 0" }}>
                  <button onClick={onSwitchView} style={{ fontSize: "20px" }}>
                    Sign up
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                height: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "20px",
                  width: "40vh",
                  borderRadius: "35px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={handleSubmit}
              >
                {"Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
