import React, { FormEvent, useState } from "react";
import { SignupParams } from "../api/UserApi";
import Modal from "../../components/Modal";
import { HandleChangeType } from "../../_common/HandleChangeType";

const Signup = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [signup, setSignup] = useState<SignupParams>({
    email: "",
    nickname: "",
    password: "",
    phone: "",
  });

  const handleChange = (event: HandleChangeType) => {
    const { name, value } = event;
  };

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
  };

  return (
    <>
      <div>
        <h2>Sign Up</h2>
      </div>

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
        <div style={{ flex: 1, height: "1px", background: "#aaa" }}></div>
        <div
          style={{
            margin: "10px 10px",
          }}
        >
          OR
        </div>
        <div style={{ flex: 1, height: "1px", background: "#aaa" }}></div>
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
        <div style={{ width: "100%", padding: "10px 0" }}>
          <a href="/sign-up" style={{ fontSize: "20px" }}>
            Sign Up
          </a>
        </div>
        {/*<button type="submit">Log In</button>*/}
      </form>
    </>
  );
};

export default Signup;
