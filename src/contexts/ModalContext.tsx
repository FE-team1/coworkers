'use client';
import { useContext, createContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalContextValue = {
  toggleModal: (id: string) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  checkIsModalOpen: (id: string) => boolean;
};

const ModalContext = createContext<ModalContextValue | null>(null);

type ModalState = {
  [id: string]: { isOpen: boolean };
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<ModalState>({});

  const openModal = (id: string) => {
    setModals((prev) => ({
      ...prev,
      [id]: { isOpen: true },
    }));
  };

  const closeModal = (id: string) => {
    setModals((prev) => ({
      ...prev,
      [id]: { isOpen: false },
    }));
  };

  const toggleModal = (id: string) => {
    setModals((prev) => ({
      ...prev,
      [id]: { isOpen: prev[id]?.isOpen !== true },
    }));
  };

  const checkIsModalOpen = (id: string) => {
    return !!modals[id]?.isOpen;
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        toggleModal,
        checkIsModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
};

export function ModalPortal({ children, modalId }: { children: React.ReactNode; modalId: string }) {
  const [modalPortal, setModalPortal] = useState<Element | null>(null);
  const { checkIsModalOpen } = useModal();

  useEffect(
    function initializeModalPortal() {
      const modalElement = document.querySelector('#modal-container');
      setModalPortal(modalElement);
    },
    [setModalPortal]
  );

  if (!modalPortal) return null;

  return <>{createPortal(checkIsModalOpen(modalId) ? children : null, modalPortal)}</>;
}
