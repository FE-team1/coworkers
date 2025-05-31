'use client';

import Image from 'next/image';
import {
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { ModalPortal } from '@/contexts/ModalContext';
import Button from '../common/Button';

interface Props {
  nickname: string;
  onGoToLoginPage: () => void;
}

export default function SignupSuccessModal({ nickname, onGoToLoginPage }: Props) {
  return (
    <ModalPortal modalId="signup-success">
      <ModalOverlay modalId="signup-success">
        <ModalContainer className="pr-4 pb-8 pl-4">
          <Image src="/icons/hello.svg" alt="user-icon" width={24} height={24} className="pb-3" />
          <ModalHeading className="text-md-md mb-2 text-white">회원가입 성공</ModalHeading>
          <ModalDescription className="text-lg-rg mb-6 w-60">
            <span className="text-primary">{nickname}</span> 님, 반가워요! <br />
            5초 뒤 자동으로 로그인됩니다.
          </ModalDescription>
          <div className="mb-3 h-2 w-full overflow-hidden rounded bg-gray-200">
            <div
              className="h-full bg-[linear-gradient(90deg,_rgba(16,185,129,1)_0%,_rgba(163,230,53,1)_100%)] transition-all duration-[5000ms]"
              style={{ width: '100%', animation: 'shrinkBar 5s linear forwards' }}
            />
          </div>
          <ModalFooter className="w-full">
            <Button variant="solid" size="fullWidth" className="w-full" onClick={onGoToLoginPage}>
              로그인 페이지로 이동
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </ModalPortal>
  );
}
