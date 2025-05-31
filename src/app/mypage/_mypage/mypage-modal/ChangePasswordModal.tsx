'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ModalContainer, ModalFooter, ModalHeading, ModalOverlay } from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import { validatePassword, validateConfirmPassword } from '@/utils/validators';
import FormField from '@/components/common/formField';
import Button from '@/components/common/Button';
import PasswordToggleButton from '@/app/(form-layout)/signup/_signup/PasswordToggleButton';
import { AUTH_ERROR_MESSAGES } from '@/constants/messages/signup';
import { Toast } from '@/components/common/Toastify';
import { updateUserPassword } from '../action';
import BouncingDots from '@/components/common/loading/BouncingDots';
import { deleteClientCookie } from '@/lib/cookie/client';
import { useUser } from '@/contexts/UserContext';

interface PasswordChangeSuccessModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: PasswordChangeSuccessModalProps) {
  const { closeModal } = useModal();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { logoutUser } = useUser();
  const INITIAL_FORM_DATA = {
    newPassword: '',
    confirmPassword: '',
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const setFieldValue = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangePassword = () => {
    startTransition(async () => {
      const isPasswordValid = validatePassword(formData.newPassword);
      const isConfirmValid = validateConfirmPassword(
        formData.newPassword,
        formData.confirmPassword
      );

      if (!isPasswordValid || !isConfirmValid) {
        return;
      }

      try {
        await updateUserPassword(formData.newPassword, formData.confirmPassword);

        deleteClientCookie('accessToken');
        deleteClientCookie('refreshToken');
        await logoutUser();

        setFormData(INITIAL_FORM_DATA);

        closeModal('change-password');
        Toast.success('비밀번호 변경 성공');
        router.replace('/login?from=password-change');
      } catch {
        Toast.error('비밀번호 변경 실패');
      }
    });
  };

  return (
    <>
      <ModalPortal modalId="change-password">
        <ModalOverlay modalId="change-password" disableOverlayClose>
          <ModalContainer className="px-6 py-6">
            <ModalHeading className="text-lg-md p-4">비밀번호 변경하기</ModalHeading>
            <div className="mx-6 w-70">
              <div className="flex flex-col gap-4">
                <FormField
                  field="input"
                  label="새 비밀번호"
                  placeholder="새 비밀번호를 입력해 주세요."
                  type={showPassword ? 'text' : 'password'}
                  isFailure={!validatePassword(formData.newPassword)}
                  errorMessage={
                    formData.newPassword.trim() === ''
                      ? AUTH_ERROR_MESSAGES.password.required
                      : AUTH_ERROR_MESSAGES.password.invalid
                  }
                  value={formData.newPassword}
                  onChange={(e) => setFieldValue('newPassword', e.target.value)}
                  rightSlot={
                    <PasswordToggleButton onToggle={setShowPassword} isVisible={showPassword} />
                  }
                />
                <FormField
                  field="input"
                  label="새 비밀번호 확인"
                  placeholder="새 비밀번호를 다시 입력해 주세요."
                  type={showConfirmPassword ? 'text' : 'password'}
                  isFailure={
                    !validateConfirmPassword(formData.newPassword, formData.confirmPassword)
                  }
                  errorMessage={
                    formData.confirmPassword.trim() === ''
                      ? AUTH_ERROR_MESSAGES.passwordConfirmation.required
                      : AUTH_ERROR_MESSAGES.passwordConfirmation.notMatch
                  }
                  value={formData.confirmPassword}
                  onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                  rightSlot={
                    <PasswordToggleButton
                      onToggle={setShowConfirmPassword}
                      isVisible={showConfirmPassword}
                    />
                  }
                />
              </div>
              <ModalFooter className="mt-6 w-full">
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline-primary"
                    size="fullWidth"
                    className="w-full"
                    onClick={() => {
                      closeModal('change-password');
                      onClose();
                    }}
                  >
                    닫기
                  </Button>

                  <Button
                    variant="solid"
                    size="fullWidth"
                    className="w-full"
                    onClick={handleChangePassword}
                    disabled={isPending}
                  >
                    {isPending ? <BouncingDots /> : '변경하기'}
                  </Button>
                </div>
              </ModalFooter>
            </div>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
