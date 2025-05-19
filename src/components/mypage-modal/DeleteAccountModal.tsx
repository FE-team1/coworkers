'use client';

import Image from 'next/image';
import {
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
  ModalPortal,
} from '@/components/common/modal';
import Button from '../common/Button';
import useModalContext from '@/components/common/modal/core/useModalContext';

export default function DeleteAccountModal() {
  const { closeModal, openModal } = useModalContext();

  return (
    <>
      <ModalPortal modalId="delete-account">
        <ModalOverlay modalId="delete-account">
          <ModalContainer>
            <Image src="/icons/danger.icon.svg" alt="!" width={24} height={24} className="m-4" />
            <ModalHeading className="text-lg-md w-full pb-2 text-white">
              회원 탈퇴를 진행하시겠어요?
            </ModalHeading>
            <ModalDescription className="text-md-md w-84 px-3 pb-5">
              그룹장으로 있는 그룹은 자동으로 삭제되고,
              <br />
              모든 그룹에서 나가집니다.
            </ModalDescription>
            <ModalFooter className="w-full">
              <div className="flex w-70 gap-2">
                <Button
                  variant="outline-gray"
                  className="w-full"
                  size="fullWidth"
                  onClick={() => closeModal('delete-account')}
                >
                  닫기
                </Button>
                <Button
                  variant="danger"
                  className="w-full"
                  size="fullWidth"
                  onClick={() => {
                    closeModal('delete-account');
                    openModal('confirm-delete-account');
                  }}
                >
                  회원 탈퇴
                </Button>
              </div>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
