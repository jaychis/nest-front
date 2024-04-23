import React, { useState } from "react";
import Modal from "../../components/Modal";
import Login from "./Login";
import Signup from "./Signup";

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
        Log In
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
          <Login
            onSwitchView={() => switchView("signup")}
            modalIsOpen={setModalIsOpen}
          />
        ) : (
          <Signup
            onSwitchView={() => switchView("login")}
            modalIsOpen={setModalIsOpen}
          />
        )}
      </Modal>
    </>
  );
};
export default UserModalForm;
