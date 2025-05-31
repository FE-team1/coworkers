'use client';
import { useModal } from '@/contexts/ModalContext';
interface ModalTriggerProps extends React.ComponentProps<'button'> {
  modalId: string;
}

export default function ModalTrigger({ modalId, onClick, children, ...props }: ModalTriggerProps) {
  const { openModal } = useModal();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    openModal(modalId);
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
