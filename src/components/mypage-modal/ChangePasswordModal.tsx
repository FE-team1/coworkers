'use client';

import { useState } from 'react';
import {
  ModalContainer,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
  ModalPortal,
} from '@/components/common/modal';
import Button from '../common/Button';
import useModalContext from '@/components/common/modal/core/useModalContext';
import FormField from '../common/formField';
import { validatePassword, validateConfirmPassword } from '@/utils/validators';
import axiosClient from '@/lib/axiosClient';
import { Toast } from '@/components/common/Toastify';
import PasswordToggleButton from '@/app/(form-layout)/signup/_signup/PasswordToggleButton';
import { AUTH_ERROR_MESSAGES } from '@/constants/messages/signup';

interface PasswordChangeSuccessModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: PasswordChangeSuccessModalProps) {
  const { closeModal } = useModalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const setFieldValue = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleChangePassword = async () => {
    const isPasswordValid = validatePassword(formData.newPassword);
    const isConfirmValid = validateConfirmPassword(formData.newPassword, formData.confirmPassword);

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    try {
      await axiosClient.patch('/user/password', {
        password: formData.newPassword,
        passwordConfirmation: formData.confirmPassword,
      });
      closeModal('change-password');
      Toast.success('비밀번호가 변경 성공');
    } catch {
      Toast.error('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
    }
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
                  placeholder="새 비밀번호를 다시 한 번 입력해 주세요."
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
                  >
                    변경하기
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
