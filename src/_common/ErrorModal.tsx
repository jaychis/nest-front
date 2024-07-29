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
          <h2>Error</h2>
          <button onClick={handleClose} style={closeButton}>X</button>
        </div>
        <div style={modalBody}>
          <p>{errorMessage}</p>
        </div>
        <div style={modalFooter}>
          <button onClick={handleClose} style={closeButton}>Close</button>
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
};

const modalContent: CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: '300px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
};

const modalHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeButton: CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.5em',
  cursor: 'pointer',
};

const modalBody: CSSProperties = {
  margin: '20px 0',
};

const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

export default ErrorModal;