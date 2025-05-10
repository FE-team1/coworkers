'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { Toast } from '@/components/common/Toastify';
import {
  ModalCloseButton,
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
  ModalPortal,
} from '@/components/common/modal';
import { Member } from '@/types/user';

type MemberRemovalModalProps = {
  member: Member;
  modalId: string;
  isRemoving: boolean;
  error: { message: string; id: string } | null;
  removeMember: () => Promise<void> | void;
};

export default function MemberRemovalModal({
  member,
  modalId,
  isRemoving,
  error,
  removeMember,
}: MemberRemovalModalProps) {
  const { userName } = member;
  const handleClickRemoveButton = async () => {
    await removeMember();
  };

  useEffect(() => {
    if (!error) return;
    Toast.error(error.message);
  }, [error]);

  return (
    <>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId}>
          <ModalContainer>
            <ModalCloseButton modalId={modalId} />
            <Image
              src="/icons/danger.icon.svg"
              alt="경고"
              width={23}
              height={22}
              className="size-6"
            />
            <ModalHeading className="mt-4 mb-2">
              <span className="text-primary">{userName}</span> 님을 그룹에서 내보내시겠어요?
            </ModalHeading>
            <ModalDescription>내보낸 멤버는 다시 초대할 수 있습니다.</ModalDescription>
            <ModalFooter className="mt-6 w-70">
              <Button
                variant="danger"
                size="fullWidth"
                onClick={handleClickRemoveButton}
                disabled={isRemoving}
              >
                {isRemoving ? '...' : '내보내기'}
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
