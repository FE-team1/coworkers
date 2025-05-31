'use client';

import Image from 'next/image';
import {
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import Button from '../common/Button';

export default function SignupFailModal() {
  const { closeModal } = useModal();

  return (
    <ModalPortal modalId="signup-fail">
      <ModalOverlay modalId="signup-fail">
        <ModalContainer className="pr-4 pb-8 pl-4">
          <Image src="/icons/danger.icon.svg" alt="!" width={24} height={24} className="pb-3" />
          <ModalHeading className="text-md-bold mb-2 text-white">회원가입 실패</ModalHeading>
          <ModalDescription className="text-gray500 text-md-md mb-6 w-60 px-3">
            회원가입 도중 문제가 발생했습니다. <br />
            다시 시도해주세요.
          </ModalDescription>
          <ModalFooter className="w-full">
            <Button
              variant="outline-gray"
              className="w-full"
              size="fullWidth"
              onClick={() => closeModal('signup-fail')}
            >
              다시 시도하기
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </ModalPortal>
  );
}
