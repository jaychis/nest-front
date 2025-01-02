import React, { CSSProperties } from 'react';

interface ErrorModalProps {
  show: boolean;
  handleClose: () => void;
  errorMessage: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ show, handleClose, errorMessage }) => {
  if (!show) return null;

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <div style={modalHeader}>
          <h2>에러</h2>
          <button onClick={handleClose} style={closeButton}>×</button>
        </div>
        <div style={modalBody}>
          <p>{errorMessage}</p>
        </div>
        <div style={modalFooter}>
          <button onClick={handleClose} style={footerButton}>닫기</button>
        </div>
      </div>
    </div>
  );
};

const modalOverlay: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2010,
};

const modalContent: CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  animation: 'fadeIn 0.3s',
};

const modalHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #ddd',
  paddingBottom: '10px',
};

const closeButton: CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.5em',
  cursor: 'pointer',
  color: '#333',
};

const modalBody: CSSProperties = {
  margin: '20px 0',
  fontSize: '16px',
  color: '#333',
};

const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const footerButton: CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#ff5a5f',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default ErrorModal;
