'use client';
import { useEffect } from 'react';
import {
  ModalCloseButton,
  ModalContainer,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
export default function Page() {
  const { openModal } = useModal();
  useEffect(() => {
    openModal('modalId');
  }, []);

  return (
    <ModalPortal modalId={'modalId'}>
      <ModalOverlay modalId={'modalId'}>
        <ModalContainer className="px-13 pt-12 pb-8 md:px-13 md:pt-12 md:pb-8">
          <ModalCloseButton modalId={'modalId'} />
          <div className="mb-6 w-70">
            <ModalHeading className="mb-2">할 일 목록 추가</ModalHeading>
          </div>
          <ModalFooter className="w-70"></ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </ModalPortal>
  );
}
