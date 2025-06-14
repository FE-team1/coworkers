'use client';

import { ModalContainer, ModalFooter, ModalHeading, ModalOverlay } from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import Image from 'next/image';
import Button from '@/components/common/Button';
interface Props {
  modalId: string;
  onDelete: () => void;
}

export default function RemoveCommentModal({ modalId, onDelete }: Props) {
  const { closeModal } = useModal();

  return (
    <>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId} onClick={() => closeModal(modalId)}>
          <ModalContainer className="md:w-full md:max-w-96">
            <Image src="/icons/danger.icon.svg" alt="!" width={20} height={20} />
            <ModalHeading className="text-md-md text-gray500 my-6 w-full">
              삭제 후에는 되돌릴 수 없습니다.
            </ModalHeading>
            <ModalFooter className="w-full">
              <div className="flex w-full gap-2">
                <Button
                  variant="outline-gray"
                  onClick={() => closeModal(modalId)}
                  fontSize="16"
                  size="fullWidth"
                >
                  닫기
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    closeModal(modalId);
                    onDelete();
                  }}
                  size="fullWidth"
                >
                  삭제하기
                </Button>
              </div>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
