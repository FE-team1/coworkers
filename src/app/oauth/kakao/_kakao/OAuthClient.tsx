'use client';

import { loginApiResponse } from '@/app/(form-layout)/login/_login/LoginForm';
import ErrorModal from '@/components/common/ErrorModal';
import useModalContext from '@/components/common/modal/core/useModalContext';
import { ERROR_MODAL_ID } from '@/constants/modal-id/error-modal';
import axiosClient from '@/lib/axiosClient';
import { setClientCookie } from '@/lib/cookie/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

/**
 * @todo
 * get user response type지정
 */

export default function OAuthClient() {
  const { openModal } = useModalContext();
  const searchParams = useSearchParams();
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const router = useRouter();

  const oauthRequest = useCallback(async () => {
    try {
      const res = await axiosClient.post<loginApiResponse>(`/auth/sinIn/KAKAO`, {
        state: state,
        redirectUri: redirectUri,
        token: code,
      });

      if (res.status && res.status === 200) {
        setClientCookie('accessToken', res.data.accessToken);
        setClientCookie('refreshToken', res.data.refreshToken);
      }

      const { data } = await axiosClient.get(`/user`);
      if (data.memberships.length < 1) {
        router.push('/nogroup');
      } else {
        router.push(`${data.memberships[0].group.id}`);
      }
    } catch {
      openModal(ERROR_MODAL_ID.OAUTH);
    }
  }, [code, openModal, redirectUri, router, state]);

  useEffect(() => {
    oauthRequest();
  }, [oauthRequest]);

  return (
    <ErrorModal
      modalId={ERROR_MODAL_ID.OAUTH}
      description="간편로그인에 실패 했습니다."
      onClick={() => router.back()}
    />
  );
}
