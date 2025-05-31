'use client';
import Image from 'next/image';
import Button from '@/components/common/Button';
import {
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import BouncingDots from '@/components/common/loading/BouncingDots';
import { Tasklist } from '@/types/tasklist';

interface TasklistDeleteModalProps {
  modalId: string;
  tasklist: Tasklist;
  isLoading: boolean;
  deleteTasklist: (tasklist: Tasklist) => void;
}

export default function TasklistDeleteModal({
  modalId,
  tasklist,
  isLoading,
  deleteTasklist,
}: TasklistDeleteModalProps) {
  const { name } = tasklist;
  const { closeModal } = useModal();

  const handleClickDeleteButton = async () => {
    deleteTasklist(tasklist);
    closeModal(modalId);
  };

  return (
    <>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId}>
          <ModalContainer className="px-12 md:max-w-96 md:px-8">
            <Image
              src="/icons/danger.icon.svg"
              alt="경고"
              width={23}
              height={22}
              className="size-6"
            />
            <ModalHeading className="mt-4 mb-2">
              <span className="text-primary">{name}</span> 목록을 정말 삭제하시겠어요?
            </ModalHeading>
            <ModalDescription>
              <span className="text-primary">{name}</span>의 할 일도 모두 삭제되며,
              <br />
              삭제 후에는 되돌릴 수 없습니다.
            </ModalDescription>
            <ModalFooter className="mt-6 w-70">
              <Button onClick={() => closeModal(modalId)} variant="outline-gray" size="fullWidth">
                닫기
              </Button>
              <Button
                onClick={handleClickDeleteButton}
                variant="danger"
                size="fullWidth"
                disabled={isLoading}
              >
                {isLoading ? <BouncingDots size={6} /> : '삭제하기'}
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
