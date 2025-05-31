type TaskModals = {
  popUpDeleteTaskModal: (modalId: string) => void;
  popUpEditTaskModal: (modalId: string) => void;
};

import { useModal } from '@/contexts/ModalContext';
export function useTaskModals(): TaskModals {
  const { openModal } = useModal();

  const popUpEditTaskModal = (modalId: string) => {
    openModal(modalId);
  };

  const popUpDeleteTaskModal = (modalId: string) => {
    openModal(modalId);
  };

  return {
    popUpEditTaskModal,
    popUpDeleteTaskModal,
  };
}
