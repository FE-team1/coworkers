'use client';
import { useState } from 'react';
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
import { AUTH_ERROR_MESSAGES } from '@/constants/messages/signup';

const redirectUrl = process.env.NEXT_PUBLIC_RESET_PASSWORD;

export default function SendResetPassword() {
  const { closeModal } = useModalContext();
  const modalId = `resetPassword`;
  const errorMessageConstant = AUTH_ERROR_MESSAGES.sendResetPassword;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForceShowError, setIsForceShowError] = useState(false);

  const sendResetPasswordLink = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.post(`/user/send-reset-password-email`, {
        email: email,
        redirectUrl: redirectUrl,
      });
      if (res.status === 200) {
        Toast.success('링크를 전송했습니다.');
        setEmail('');
        setErrorMessage('');
        closeModal(modalId);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 400) return setErrorMessage(errorMessageConstant.notMatch);
        setIsForceShowError(true);
      }
      setErrorMessage('예상치 못한 오류가 발생했습니다.');
      setIsForceShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    if (!validateEmail(value)) return setErrorMessage(errorMessageConstant.invalid);
    if (validateEmail(value)) return setErrorMessage('');
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
                isFailure={!validateEmail(email) || !!errorMessage || isForceShowError}
                isSuccess={validateEmail(email) && !Boolean(errorMessage)}
                errorMessage={email === '' ? errorMessageConstant.required : errorMessage}
              />
            </div>
            <ModalFooter className="flex w-full gap-2">
              <Button
                size="fullWidth"
                variant="outline-primary"
                onClick={() => {
                  setEmail('');
                  setErrorMessage('');
                  closeModal(modalId);
                }}
              >
                닫기
              </Button>
              <Button
                size="fullWidth"
                variant="solid"
                disabled={isLoading || !validateEmail(email)}
                onClick={sendResetPasswordLink}
              >
                {isLoading ? '...' : '링크 보내기'}
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
