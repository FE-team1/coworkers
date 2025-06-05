import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axiosClient from '@/lib/axiosClient';
import { useModal } from '@/contexts/ModalContext';
import { Toast } from '@/components/common/Toastify';
import { setClientCookie } from '@/lib/cookie/client';
import { useUser } from '@/contexts/UserContext';

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
}

const signupUser = async (data: SignupRequest): Promise<void> => {
  await axiosClient.post('/auth/signUp', data);
};

const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post('/auth/signIn', data);
  return response.data;
};

export const useSignup = () => {
  const { openModal } = useModal();
  const router = useRouter();
  const { fetchUser } = useUser();

  const [duplicateError, setDuplicateError] = useState({
    nickname: false,
    email: false,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<LoginRequest | null>(null);

  const loginTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoLoginCancelledRef = useRef(false);

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      openModal('signup-success');
      setIsSuccess(true);
      autoLoginCancelledRef.current = false;

      if (pendingLogin) {
        loginTimeoutRef.current = setTimeout(() => {
          if (!autoLoginCancelledRef.current) {
            loginMutation.mutate(pendingLogin);
          }
        }, 5000);
      }
    },
    onError: (error: unknown) => {
      const err = error as ErrorResponse;
      const message = err.response?.data?.message || '';

      setDuplicateError({
        email: message.includes('이메일'),
        nickname: message.includes('닉네임'),
      });

      Toast.error('회원가입 실패');
      setPendingLogin(null);
      autoLoginCancelledRef.current = true;
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data: LoginResponse) => {
      const { accessToken, refreshToken } = data;

      setClientCookie('accessToken', accessToken);
      setClientCookie('refreshToken', refreshToken);

      await fetchUser();
      router.push('/nogroup');
    },
    onError: () => {
      Toast.error('자동 로그인 실패.');
      router.push('/login');
    },
  });

  const handleSignup = useCallback(
    (formData: SignupRequest) => {
      if (signupMutation.isPending || loginMutation.isPending) {
        return;
      }

      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
        loginTimeoutRef.current = null;
      }

      signupMutation.mutate(formData);
    },
    [signupMutation, loginMutation]
  );

  const handleAutoLogin = useCallback((email: string, password: string) => {
    setPendingLogin({ email, password });
  }, []);

  const cancelAutoLogin = useCallback(() => {
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }

    autoLoginCancelledRef.current = true;
    setPendingLogin(null);
  }, []);

  const clearDuplicateError = useCallback((field: 'email' | 'nickname') => {
    setDuplicateError((prev) => ({ ...prev, [field]: false }));
  }, []);

  const cleanup = useCallback(() => {
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }
    autoLoginCancelledRef.current = true;
  }, []);

  const isFormDisabled = signupMutation.isPending || loginMutation.isPending;

  const isLoading = signupMutation.isPending || loginMutation.isPending;

  return {
    duplicateError,
    isSuccess,
    isLoading,
    isFormDisabled,

    signupMutation,
    loginMutation,

    handleSignup,
    handleAutoLogin,
    cancelAutoLogin,
    clearDuplicateError,
    cleanup,

    isPendingAutoLogin: !!pendingLogin && !autoLoginCancelledRef.current,
  };
};
