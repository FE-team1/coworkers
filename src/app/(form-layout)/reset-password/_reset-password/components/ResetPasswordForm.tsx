'use client';
import PasswordToggleButton from '@/app/(form-layout)/signup/_signup/PasswordToggleButton';
import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import PATHS from '@/constants/paths';
import usePasswordVisibility from '@/utils/use-password-visibility';
import { validateConfirmPassword, validatePassword } from '@/utils/validators';
import { useRouter } from 'next/navigation';
import { useActionState, useRef, useState } from 'react';
import { submitResetPassword } from '../utils/submit-reset-password';
import { PasswordForm } from '../types/form-data-type';
import { Toast } from '@/components/common/Toastify';
import { AUTH_ERROR_MESSAGES } from '@/constants/messages/signup';

interface Props {
  token: string | string[] | undefined;
}

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const constant = AUTH_ERROR_MESSAGES;

  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const [formData, setFormData] = useState<PasswordForm>({
    password: '',
    passwordConfirmation: '',
  });

  const [_unused, action, pending] = useActionState(() => {
    submitResetPassword(token, formData).then(() => {
      Toast.success('비밀 번호 변경에 성공했습니다!');
      router.push('/login');
    });
  }, null);

  if (!token) {
    Toast.error('잘못된 접근입니다. 다시 시도해주세요');
    router.push(PATHS.HOME);
    return null;
  }

  const formFieldArray = [
    {
      field: 'input',
      label: '비밀번호',
      name: 'password',
      type: isPasswordVisible.password ? 'text' : 'password',
      value: formData.password,
      isFailure: !validatePassword(formData.password),
      isSuccess: validatePassword(formData.password),
      errorMessage:
        formData.password === '' ? constant.password.required : constant.password.invalid,
      placeholder: '비밀번호 (영문, 숫자 포함, 12자 이내)를 입력해주세요.',
      rightSlot: (
        <PasswordToggleButton
          isVisible={isPasswordVisible.password}
          onToggle={() => togglePasswordVisibility('password')}
        />
      ),
    },
    {
      field: 'input',
      label: '비밀번호 확인',
      name: 'passwordConfirmation',
      type: isPasswordVisible.confirmPassword ? 'text' : 'password',
      value: formData.passwordConfirmation,
      isFailure: !validateConfirmPassword(formData.password, formData.passwordConfirmation),
      isSuccess: validateConfirmPassword(formData.password, formData.passwordConfirmation),
      errorMessage:
        formData.passwordConfirmation === ''
          ? constant.passwordConfirmation.required
          : constant.passwordConfirmation.notMatch,
      placeholder: '새 비밀번호를 다시 한번 입력해주세요.',
      rightSlot: (
        <PasswordToggleButton
          isVisible={isPasswordVisible.confirmPassword}
          onToggle={() => togglePasswordVisibility('confirmPassword')}
        />
      ),
    },
  ] as const;

  const handleChangeFormData = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form action={action} ref={formRef} className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        {formFieldArray.map((field) => {
          return (
            <FormField
              key={field.name}
              required
              gapSize="12"
              labelSize="16/16"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeFormData(field.name, e)
              }
              {...field}
            />
          );
        })}
      </div>
      <Button
        disabled={
          !(
            validatePassword(formData.password) &&
            validateConfirmPassword(formData.password, formData.passwordConfirmation)
          ) || pending
        }
        type="submit"
        size="fullWidth"
      >
        {pending ? '...' : '재설정'}
      </Button>
    </form>
  );
}
