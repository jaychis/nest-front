import styled from 'styled-components';
import { breakpoints } from '../_common/breakpoint';

interface Props {
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly buttonLabel?: string;
  readonly top: string;
}
const Modal = ({ children, isOpen, onClose, buttonLabel,top }: Props) => {
  if (!isOpen) return null;

  return (
    <ModalContainer style = {{top: top}}>
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
  z-index: 9999;
  width: 80vw;
  max-width: 600px;
  
  @media (max-width: ${breakpoints.mobile}) {
    top: 35vh !important ;
    left: 2%;
    width: 90%;
    height: 100vh;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}){
    left: 20%;
    width: 80%;
  }

  @media(min-width: ${breakpoints.tablet}){
    left: 30%;
  }
`;

const ModalBody = styled.div`
  background-color: #fff;
  border-radius: 25px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}){
    width: 85%;
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
