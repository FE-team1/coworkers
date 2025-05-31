'use client';
import Image from 'next/image';
import Button from '@/components/common/Button';
import {
  ModalCloseButton,
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import { Member } from '@/types/user';

type MemberDetailModalProps = {
  modalId: string;
  member: Member;
};

export default function MemberDetailModal({ modalId, member }: MemberDetailModalProps) {
  const { userName, userImage, userEmail } = member;
  const { closeModal } = useModal();
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(userEmail);
  };

  return (
    <ModalPortal modalId={modalId}>
      <ModalOverlay modalId={modalId}>
        <ModalContainer className="px-8 pt-12 pb-8 md:px-8 md:pt-12 md:pb-8">
          <ModalCloseButton modalId={modalId} />
          <div className="relative size-11.5">
            {userImage ? (
              <Image
                src={userImage}
                fill
                className="rounded-full object-cover"
                alt={`${userName}님의 프로필 이미지`}
              />
            ) : (
              <Image
                width={24}
                height={24}
                src="/icons/profile-icon.svg"
                alt="기본 프로필 이미지"
                className="size-full"
              />
            )}
          </div>
          <ModalHeading className="mt-4 mb-2">{userName}</ModalHeading>
          <ModalDescription className="text-xs-rg">{userEmail}</ModalDescription>
          <ModalFooter className="mt-6 w-70">
            <Button
              variant="solid"
              size="fullWidth"
              onClick={() => {
                copyEmailToClipboard();
                closeModal(modalId);
              }}
            >
              이메일 복사하기
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </ModalPortal>
  );
}
