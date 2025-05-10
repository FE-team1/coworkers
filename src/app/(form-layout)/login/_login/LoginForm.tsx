'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { CancelTokenSource, isAxiosError } from 'axios';
import FormField from '@/components/common/formField';
import Button from '@/components/common/Button';
import PasswordToggleButton from '@/app/(form-layout)/signup/_signup/PasswordToggleButton';
import axiosClient from '@/lib/axiosClient';
import { setClientCookie } from '@/lib/cookie/client';
import { validateEmail } from '@/utils/validators';
import { User } from '@/types/user';
import PATHS from '@/constants/paths';
import SendResetPassword from './SendResetPassword';

export interface loginApiResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export default function LoginForm() {
  const router = useRouter();
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoggingIn && cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    setIsLoggingIn(true);
    setIsLoginFailed(false);
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const res = await axiosClient.post<loginApiResponse>(
        `/auth/signIn`,
        { email, password },
        { cancelToken: cancelTokenRef.current.token }
      );

      const data = res.data;
      setClientCookie('accessToken', data.accessToken);
      setClientCookie('refreshToken', data.refreshToken);
      router.push(PATHS.HOME);
      setIsLoggingIn(false);
    } catch (error) {
      if (axios.isCancel(error)) return;

      if (isAxiosError(error)) {
        setIsLoginFailed(true);
      } else {
        console.error('로그인 중 에러 발생:', error);
      }
      setPassword('');
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-6">
        <FormField
          name="email"
          label="이메일"
          type="email"
          field="input"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          isFailure={!isEmailValid}
          errorMessage="유효한 이메일이 아닙니다."
          disabled={isLoggingIn}
        />
        <FormField
          name="password"
          label="비밀번호"
          type={isPasswordVisible ? 'text' : 'password'}
          field="input"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          isFailure={!isPasswordValid}
          errorMessage="비밀번호를 입력해주세요."
          rightSlot={
            <PasswordToggleButton
              isVisible={isPasswordVisible}
              onToggle={() => setIsPasswordVisible((prev) => !prev)}
            />
          }
          disabled={isLoggingIn}
        />
      </div>
      <SendResetPassword />
      <Button
        type="submit"
        variant="solid"
        size="fullWidth"
        fontSize="16"
        className="mt-10"
        disabled={!isFormValid || isLoggingIn}
      >
        {isLoggingIn ? '...' : '로그인'}
      </Button>
      {isLoginFailed && (
        <p className="text-md-md text-danger mt-4 self-center text-center">
          이메일 또는 비밀번호가 잘못 되었습니다.
          <br />
          이메일과 비밀번호를 정확히 입력해주세요.
        </p>
      )}
    </form>
  );
}
