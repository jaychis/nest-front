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
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<modalType>("login");

  const switchView = (view: modalType) => {
    setActiveView(view);
  };

  return (
    <>
      <button
        onClick={() => {
          setModalIsOpen(true);
          setActiveView("login");
        }}
      >
        Log In!!
      </button>
      <Modal
        buttonLabel={activeView}
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
        // onSubmit={handleSubmit}
      >
        {activeView === "login" ? (
          <Login onSwitchView={() => switchView("signup")} />
        ) : (
          <Signup onSwitchView={() => switchView("login")} />
        )}
      </Modal>
    </>
  );
};
export default UserModalForm;
