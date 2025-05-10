'use client';
import PasswordToggleButton from '@/app/(form-layout)/signup/_signup/PasswordToggleButton';
import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import PATHS from '@/constants/paths';
import usePasswordVisibility from '@/utils/use-password-visibility';
import { validateConfirmPassword, validatePassword } from '@/utils/validators';
import { useRouter } from 'next/navigation';
import { useActionState, useRef, useState } from 'react';
import { submitResetPassword } from '../actions';
import { PasswordForm } from '../types/form-data-type';
import { Toast } from '@/components/common/Toastify';

interface Props {
  token: string | string[] | undefined;
}

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { isPasswordVisible, togglePasswordVisibility } = usePasswordVisibility();
  const [formData, setFormData] = useState<PasswordForm>({
    password: '',
    passwordConfirmation: '',
  });

  const [_unused, action, pending] = useActionState(async () => {
    await submitResetPassword(token, formData);
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
        formData.passwordConfirmation === ''
          ? '비밀번호를 입력해주세요.'
          : '비밀번호는 8자 이상 20자 이하이며 영문자, 숫자, 특수문자(!@#$%^&*)만 사용할 수 있습니다.',
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
          ? '비밀번호를 입력해주세요.'
          : '비밀번호가 일치하지 않습니다.',
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
    setFormData((prev) => ({ ...prev, [name]: e.target.value.trim() }));
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
        재설정
      </Button>
    </form>
  );
}
