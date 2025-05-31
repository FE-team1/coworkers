'use client';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useModal } from '@/contexts/ModalContext';
interface ModalOverlayProps extends React.ComponentProps<'div'> {
  modalId: string;
  disableOverlayClose?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ModalOverlay({
  modalId,
  disableOverlayClose = false,
  onClick = () => {},
  className,
  children,
  ...props
}: ModalOverlayProps) {
  const { closeModal } = useModal();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !disableOverlayClose) {
      onClick(e);
      closeModal(modalId);
    }
  };

  useEffect(function lockBodyScroll() {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      className={clsx(
        'fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-md transition',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}
