import React from "react";

interface Props {
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly buttonLabel: string;
  readonly onSubmit: () => void;
}
const Modal = ({ children, isOpen, onClose, buttonLabel, onSubmit }: Props) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // zIndex: 1000,
        }}
      >
        <div>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "25px",
              padding: "25px",
              minWidth: "55vh",
              minHeight: "65vh",
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
                onClick={onClose}
              >
                Close
              </button>
            </div>
            <div
              style={{
                display: "flex",
                // height: "650px",
                height: "53vh",
                justifyContent: "center",
              }}
            >
              {children}
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
                onClick={() => onSubmit()}
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
