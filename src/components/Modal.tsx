import styled from 'styled-components';

interface Props {
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly buttonLabel?: string;
  // readonly onSubmit: () => void;
}
const Modal = ({ children, isOpen, onClose, buttonLabel}: Props) => {

  if (!isOpen) return null;
  
  return (
      <ModalContainer>
          <ModalBody>
            <div style={{ display: "flex", height: "20%", marginBottom: '2vh' }}>
              <CloseButton onClick={onClose}>
                Close
              </CloseButton>
            </div>
              {children}
          </ModalBody>
      </ModalContainer>
    
  );
};

export default Modal;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.30);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBody = styled.div`
  background-color: #fff;
  border-radius: 25px;
  padding: 25px;
  min-width: 450px; 
  max-width: 400px;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  padding: 20px;
  background: red;
  color: white;
  border: none;
  border-radius: 35px;
  cursor: pointer;
  margin-left: auto;
  margin-right: 10px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  width: 80%;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  height: 20%;
  justify-content: center;
  align-items: center;
`;
