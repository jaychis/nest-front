// Alert 컴포넌트
import React from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

// Alert 컴포넌트의 타입 정의
interface AlertProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "warning" | "info";
}

// Alert 컴포넌트 정의
const Alert = ({ message, onClose, type = "info" }: AlertProps) => {
  return ReactDOM.createPortal(
    <div className={`alert-container ${type}`}>
      <div className="alert-content">
        <span>{message}</span>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Alert;

/// CSS 스타일을 JS 파일에 포함
const styles = `
.alert-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-container.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.alert-container.error {
  background-color: #f2dede;
  color: #a94442;
}

.alert-container.warning {
  background-color: #fcf8e3;
  color: #8a6d3b;
}

.alert-container.info {
  background-color: #d9edf7;
  color: #31708f;
}

.alert-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.close-button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2em;
}
`;

// CSS 스타일을 동적으로 추가
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);