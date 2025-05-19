'use client';
import {
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
  ModalPortal,
} from '@/components/common/modal';
import Image from 'next/image';
import Button from '@/components/common/Button';
import useModalContext from '@/components/common/modal/core/useModalContext';

interface Props {
  taskName: string;
  modalId: string;
  deleteTask: () => void;
}

export default function RemoveTaskModal({ taskName, modalId, deleteTask }: Props) {
  const { closeModal } = useModalContext();

  return (
    <>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId} onClick={() => closeModal(modalId)}>
          <ModalContainer className="md:w-full md:max-w-96">
            <Image src="/icons/danger.icon.svg" alt="!" width={20} height={20} />
            <ModalHeading className="mt-4 mb-2">
              {`'${taskName}'`}
              <br /> 할 일을 정말 삭제하시겠어요?
            </ModalHeading>
            <ModalDescription className="text-md-md text-gray500 mb-6 w-full">
              삭제 후에는 되돌릴 수 없습니다.
            </ModalDescription>
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
                <Button variant="danger" onClick={deleteTask} size="fullWidth">
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
