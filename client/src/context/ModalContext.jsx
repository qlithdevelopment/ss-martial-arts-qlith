import React, { createContext, useContext, useState } from 'react';
import CustomDialog from '../components/common/CustomDialog';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  const showModal = (config) => {
    setModalConfig({
      ...config,
      isOpen: true,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel'
    });
  };

  const showConfirm = (config) => showModal({ ...config, type: 'confirm' });
  const showSuccess = (config) => showModal({ ...config, type: 'success' });
  const showError = (config) => showModal({ ...config, type: 'error' });
  const showWarning = (config) => showModal({ ...config, type: 'warning' });
  const showInfo = (config) => showModal({ ...config, type: 'info' });

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showModal, showConfirm, showSuccess, showError, showWarning, showInfo, closeModal }}>
      {children}
      <CustomDialog config={modalConfig} onClose={closeModal} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
