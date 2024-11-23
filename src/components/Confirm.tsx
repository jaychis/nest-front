import { useState } from "react";
import styled from 'styled-components';

interface ConfirmProps {
    readonly onClickOk:() => void;
    readonly onClickCancel:() => void;
    readonly message: string;
    readonly title: string
}

const Confirm = ({ message,title, onClickOk, onClickCancel }: ConfirmProps) => {

    return(
        <Overlay>
            <DialogBox>
                <DialogTitle>{title}</DialogTitle>
                <DialogMessage>{message}</DialogMessage>
                <ButtonContainer>
                <CancelButton onClick={onClickCancel}>CANCEL</CancelButton>
                <ConfirmButton onClick={onClickOk}>OK</ConfirmButton>
                </ButtonContainer>
            </DialogBox>
        </Overlay>
    )
}

export default Confirm

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const DialogBox = styled.div`
  background: #fff;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;

  @media (min-width: 768px) {
    width: 80%;
  }
`;

const DialogTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 4vh;
`;

const DialogMessage = styled.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #aadfff;
  border-radius: 5px;
  background: transparent;
  color: #aadfff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5f7ff;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background: #aadfff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #87c3ff;
  }
`;