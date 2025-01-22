import styled from 'styled-components';

interface AlertModalProps {
  readonly title: string;
  readonly message: string;
  readonly onClose: () => void;
}

const AlertModal = ({ title, message, onClose }: AlertModalProps) => {
  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <Message>{message}</Message>
          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
  text-align: center;
`;

const Message = styled.p`
  font-size: 16px;
  color: #555;
  margin: 0 0 1rem;
`;

const ConfirmButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

export default AlertModal;
