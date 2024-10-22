// hooks/usePartyModal.js
import { useState } from 'react';

export const usePartyModal = () => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    title: '',
    loading: false
  });

  const openModal = (type, title = '') => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      loading: false
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const setLoading = (loading) => {
    setModalConfig(prev => ({
      ...prev,
      loading
    }));
  };

  return {
    modalConfig,
    openModal,
    closeModal,
    setLoading
  };
};