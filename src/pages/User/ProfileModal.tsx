import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root"); // or the correct selector where your app is mounted

interface ProfileModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  buttonRef: React.RefObject<HTMLDivElement>; // 버튼 위치 참조
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onRequestClose, buttonRef }) => {
  const navigate = useNavigate();
  const [modalStyle, setModalStyle] = useState({});

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const modalWidth = 200; // 모달의 너비
      const leftPosition = rect.left + window.scrollX - (modalWidth - rect.width) / 2;

      setModalStyle({
        top: `${rect.top + rect.height + window.scrollY}px`,
        left: `${leftPosition}px`,
        transform: 'none',
        width: `${modalWidth}px`,
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      });
    }
  }, [isOpen, buttonRef]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const handleMyPage = () => {
    onRequestClose();
    navigate("/users/profile");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          ...modalStyle,
          right: 'auto',
          bottom: 'auto',
          transform: 'none',
          width: '200px',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <h2 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>프로필</h2>
      <button 
        onClick={handleMyPage} 
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          backgroundColor: '#84d7fb',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          textAlign: 'center'
        }}
      >
        마이페이지
      </button>
      <button 
        onClick={handleLogout} 
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          backgroundColor: '#DC3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          textAlign: 'center'
        }}
      >
        로그아웃
      </button>
    </Modal>
  );
};

export default ProfileModal;