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
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  nickname: string;
}

export default function SignupSuccessModal({ nickname }: Props) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

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
          <ModalFooter className="w-full">
            <Button
              variant="solid"
              size="fullWidth"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              로그인 페이지로 이동
            </Button>
          </ModalFooter>
        </ModalContainer>
      </ModalOverlay>
    </ModalPortal>
  );
}
