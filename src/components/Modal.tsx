import React, { useState } from "react";

interface Props {
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}
const Modal = ({ children, isOpen, onClose }: Props) => {
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
          <button
            style={{
              alignSelf: "flex-end",
              padding: "5px 10px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "25px",
              padding: "20px",
              minWidth: "50vh",
              minHeight: "65vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {children}
          </div>
        </div>
        <div>버튼</div>
      </div>
    </>
  );
};

export default Modal;
