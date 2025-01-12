import styled from 'styled-components';
import { breakpoints } from '../_common/breakpoint';

interface Props {
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly buttonLabel?: string;
  readonly top: string;
}

const Modal = ({ children, isOpen, onClose, buttonLabel, top }: Props) => {
  if (!isOpen) return null;

  return (
    <ModalContainer style={{ top: top }}>
      <ModalBody>
        <CloseButton onClick={onClose}>Close</CloseButton>
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
  max-height: 90vh; /* 모달 최대 높이 설정 */
  overflow: hidden; /* 내부 내용이 넘칠 경우 숨김 처리 */
  background-color: rgba(0, 0, 0, 0.5); /* 모달 뒤 배경 */
  
  @media (max-width: ${breakpoints.mobile}) {
    top: 35vh !important;
    left: 2%;
    width: 90%;
    height: 100vh;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
    left: 20%;
    width: 80%;
  }

  @media (min-width: ${breakpoints.tablet}) {
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
  overflow: auto; /* 스크롤 활성화 */
  max-height: 90vh; /* ModalContainer의 높이와 동일하게 설정 */
  
  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
    width: 85%;
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  padding: 10px 15px;
  background: red;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin-bottom: 15px;
`;