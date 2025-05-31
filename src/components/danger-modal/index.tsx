'use client';
import {
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import Image from 'next/image';
import Button from '@/components/common/Button';

interface DangerModalProps {
  modalId: string;
  heading: React.ReactNode;
  description?: React.ReactNode;
  closeButtonText?: string;
  confirmButton: React.ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
}
export default function DangerModal({
  modalId,
  heading,
  description,
  closeButtonText,
  confirmButton,
  onConfirm,
  disabled,
}: DangerModalProps) {
  const { closeModal } = useModal();

  const closeButton = closeButtonText ? closeButtonText : '닫기';

  return (
    <>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId}>
          <ModalContainer className="flex gap-4 md:w-full md:max-w-96">
            <Image src="/icons/danger.icon.svg" alt="!" width={24} height={24} />
            <ModalHeading className="text-lg-md text-gray100">{heading}</ModalHeading>
            <ModalDescription className="text-md-md text-gray300 -mt-1.5">
              {description}
            </ModalDescription>
            <ModalFooter className="mt-2 w-full">
              <div className="flex w-full gap-2">
                <Button
                  onClick={() => {
                    closeModal(modalId);
                  }}
                  variant="outline-gray"
                  size="fullWidth"
                >
                  {closeButton}
                </Button>
                <Button onClick={onConfirm} variant="danger" size="fullWidth" disabled={disabled}>
                  {confirmButton}
                </Button>
              </div>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
