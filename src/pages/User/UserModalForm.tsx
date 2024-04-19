import React, { FormEvent, useEffect, useState } from "react";
import { LoginAPI, LoginParams } from "../api/UserApi";
import { HandleChangeType } from "../../_common/HandleChangeType";
import Modal from "../../components/Modal";
import Login from "./Login";
import Signup from "./Signup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { openLogin } from "../../reducers/userModalSlice";

type modalType = "login" | "signup";
const UserModalForm = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isModalType, setModalType] = useState<modalType>("login");
  const [login, setLogin] = useState<LoginParams>({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { modalType } = useSelector((state: RootState) => state.userModal);

  useEffect(() => {
    console.log("isModalType : ", isModalType);
    console.log("modalType : ", modalType);
    setModalType(modalType);
  }, [isModalType, modalType]);

  const handleChange = (event: HandleChangeType): void => {
    const { name, value } = event;

    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    LoginAPI(login)
      .then((res): void => {
        const response = res.data.response;

        if (res.status === 201 && response) setModalOpen(false);
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <button
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Log In!!
      </button>
      <Modal
        buttonLabel={isModalType}
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          dispatch(openLogin());
        }}
        onSubmit={handleSubmit}
      >
        {isModalType === "login" ? <Login /> : <Signup />}
      </Modal>
      <div style={{ width: "100%", padding: "10px 0" }}>
        {/*<a href="/sign-up">Sign Up</a>*/}
        <button
          onClick={() => {
            // setModalOpen(true);
            setModalType("signup");
          }}
          style={{ fontSize: "20px" }}
        >
          Sign up
        </button>
      </div>
    </>
  );
};
export default UserModalForm;
