// Alert 컴포넌트
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

// Alert 컴포넌트의 타입 정의
interface AlertProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning' | 'info';
}

// Alert 컴포넌트 정의
const Alert = ({ message, type, onClose }: AlertProps) => {
  return (
    <AlertContainer className={type}>
      <AlertContent>
        <span>{message}</span>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </AlertContent>
    </AlertContainer>
  );
};

export default Alert;

const AlertContainer = styled.div`
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

  &.success {
    background-color: #dff0d8;
    color: #3c763d;
  }

  &.error {
    background-color: #f2dede;
    color: #a94442;
  }

  &.warning {
    background-color: #fcf8e3;
    color: #8a6d3b;
  }

  &.info {
    background-color: #d9edf7;
    color: #31708f;
  }
`;

const AlertContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2em;
`;
