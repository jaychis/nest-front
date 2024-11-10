import React, { createContext, useState, useContext, ReactNode } from 'react';
import ErrorModal from './ErrorModal';

interface ErrorContextType {
  showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (message: string) => {
    setErrorMessage(message);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  return (
    <ErrorContext.Provider value={{ showError }}>
      <ErrorModal
        show={show}
        handleClose={handleClose}
        errorMessage={errorMessage}
      />
      {children}
    </ErrorContext.Provider>
  );
};
