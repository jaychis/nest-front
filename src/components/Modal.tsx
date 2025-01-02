import styled from 'styled-components';
import { breakpoints } from '../_common/breakpoint';

interface Props {
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly buttonLabel?: string;
}
const Modal = ({ children, isOpen, onClose, buttonLabel }: Props) => {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalBody>
        <div style={{ display: 'flex', height: '20%', marginBottom: '2vh' }}>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </div>
        {children}
      </ModalBody>
    </ModalContainer>
  );
};

export default Modal;

const ModalContainer = styled.div`
  position: fixed;
  top: 500%;
  left: 9%;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  width: 80%;

  @media (max-width: ${breakpoints.mobile}) {
    top: 170%;
    left: 0%;
    width: 100%;
    height: 100vh;
  }
`;

const ModalBody = styled.div`
  background-color: #fff;
  width: 30%;
  border-radius: 25px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
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
