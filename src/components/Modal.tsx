import styled from 'styled-components';
import { breakpoints } from '../_common/breakpoint';
import { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  readonly children: React.ReactNode;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly buttonLabel?: string;
  readonly top: string;
}

const Modal = ({ children, isOpen, onClose, buttonLabel, top }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (modalRef?.current && !modalRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, [onClose, modalRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalContainer
      style={{ top: top }}
      className="modalContainer"
      ref={modalRef}
    >
      <ModalBody>
        <CloseButton onClick={onClose}>Close</CloseButton>
        {children}
      </ModalBody>
    </ModalContainer>,
    document.body,
  );
};

export default Modal;

const ModalContainer = styled.div`
  position: fixed;
  z-index: 9999;
  max-width: 500px;
  max-height: 600px;
  overflow: hidden;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  border-radius: 25px;
  width: 100%;
  text-align: center;
  overflow: auto;

  @media (max-width: ${breakpoints.mobile}) {
    top: 35vh !important;
    left: 50% !important;
    transform: translateX(-50%);
    width: 95%;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
    left: 50%;
    top: 35vh;
    transform: translateX(-50%);
    width: 80%;
  }

  @media (min-width: ${breakpoints.tablet}) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const ModalBody = styled.div`
  background-color: #fff;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
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
  margin: 15px 15px 15px 0;
`;
