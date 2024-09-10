import "./UserModalForm.css";
import React, { useState } from "react";
import Modal from "../../components/Modal";
import Login from "./Login";
import Signup from "./Signup";
import { useDispatch, useSelector,  } from "react-redux";
import { RootState } from "../../store/store";
import { UserModalState, setModalState} from "../../reducers/modalStateSlice";

  
type modalType = "login" | "signup";
  const UserModalForm = () => {

  const dispatch = useDispatch();
  const modalState : UserModalState = useSelector((state: RootState) => state.modalState);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<modalType>("login");
  const [isLoginHovered, setIsLoginHovered] = useState<boolean>(false);
  
  const openModal = () => {
    dispatch(setModalState(!modalState.modalState));
  };
  
  const switchView = (view: modalType) => {
    setActiveView(view);
  };

  return (
    <>
      <div
        className = 'modalContainer'
        style={{
          marginRight: "5px",
          marginLeft: "5px",
          width: "70px",
          height: "50px",
          display: "flex",
          justifyContent: "center", // 가로 중앙 정렬
          alignItems: "center", // 세로 중앙 정렬
          borderRadius: "30px",
        }}
      >
        <button
          onClick={() => {
            setModalIsOpen(true);
            setActiveView("login");
          }}
          style={{
            height: "100%",
            width: "100%",
            border: "none",
            backgroundColor: isLoginHovered ? "#77C2E2" : "#84d7fb",
            borderRadius: "30px",
            fontWeight: "bold",
            color: "white",
          }}
          className="my-component"
          onMouseEnter={() => setIsLoginHovered(true)}
          onMouseLeave={() => setIsLoginHovered(false)}
        >
          <span style={{ fontWeight: "10000" }}>Log In</span>
        </button>
      </div>

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
