'use client';
import { useState, useTransition } from 'react';
import Button from '@/components/common/Button';
import {
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
  ModalPortal,
  ModalTrigger,
} from '@/components/common/modal';
import useModalContext from '@/components/common/modal/core/useModalContext';
import axiosClient from '@/lib/axiosClient';
import FormField from '@/components/common/formField';
import { validateEmail } from '@/utils/validators';
import { AxiosError } from 'axios';
import { Toast } from '@/components/common/Toastify';

const redirectUrl = process.env.NEXT_PUBLIC_RESET_PASSWORD;

export default function SendResetPassword() {
  const { closeModal } = useModalContext();
  const modalId = `resetPassword`;

  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('이메일을 입력해주세요');

  const sendResetPasswordLink = () => {
    startTransition(async () => {
      try {
        const res = await axiosClient.post(`/user/send-reset-password-email`, {
          email: email,
          redirectUrl: redirectUrl,
        });
        if (res.status === 200) {
          Toast.success('링크를 전송했습니다.');
          setErrorMessage('이메일을 입력해주세요');
          setEmail('');
          closeModal(modalId);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 400) return setErrorMessage('존재하지 않는 유저입니다.');
        }
        setErrorMessage('예상치 못한 오류가 발생했습니다.');
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    if (value === ' ') return setErrorMessage('이메일을 입력해주세요');
    if (!validateEmail(value)) return setErrorMessage('이메일 형식을 입력해주세요.');
  };

  return (
    <>
      <ModalTrigger
        className="text-md-md text-primary mt-3 w-fit self-end underline"
        modalId={modalId}
        type="button"
      >
        비밀번호를 잊으셨나요?
      </ModalTrigger>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId}>
          <ModalContainer className="md:w-full md:max-w-96">
            <div className="mb-6 w-full">
              <ModalHeading className="mb-2">비밀번호 재설정</ModalHeading>
              <ModalDescription className="text-md-md text-gray500 mb-6 w-full">
                비밀번호 재설정 링크를 보내드립니다.
              </ModalDescription>
              <FormField
                field="input"
                placeholder="가입하신 이메일을 입력하세요"
                value={email}
                onChange={handleChange}
                name="email"
                isFailure={!validateEmail(email) || !!errorMessage}
                isSuccess={validateEmail(email)}
                errorMessage={errorMessage}
              />
            </div>
            <ModalFooter className="flex w-full gap-2">
              <Button
                size="fullWidth"
                variant="outline-primary"
                onClick={() => {
                  setErrorMessage('이메일을 입력해주세요');
                  setEmail('');
                  closeModal(modalId);
                }}
              >
                닫기
              </Button>
              <Button
                size="fullWidth"
                variant="solid"
                disabled={isPending || !validateEmail(email)}
                onClick={sendResetPasswordLink}
              >
                링크 보내기
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
