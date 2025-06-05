'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserNickname, verifyPassword } from './_mypage/action';
import ProfileImageUploader from './_mypage/ProfileImageUploader';
import NicknameField from './_mypage/NicknameField';
import PasswordField from './_mypage/PasswordField';
import { Toast } from '@/components/common/Toastify';
import ChangePasswordModal from './_mypage/mypage-modal/ChangePasswordModal';
import DeleteAccountModal from './_mypage/mypage-modal/DeleteAccountModal';
import ConfirmDeleteAccountModal from './_mypage/mypage-modal/ConfirmDeleteAccountModal';
import { useModal } from '@/contexts/ModalContext';
import FormField from '@/components/common/formField';
import { useUser } from '@/contexts/UserContext';

export default function MyPageClient() {
  const { user, email, fetchUser, setUser } = useUser();
  const [image, setImage] = useState(user?.image ?? '');
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();

  const updateNicknameMutation = useMutation({
    mutationFn: (newNickname: string) => updateUserNickname(newNickname),
    onSuccess: async () => {
      await fetchUser();
      queryClient.invalidateQueries({ queryKey: ['user'] });
      Toast.success('닉네임 변경 성공');
    },
    onError: (error) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const message = errorObj?.response?.data?.message || '닉네임을 변경할 수 없습니다.';
      setNicknameError(message);
      Toast.error('닉네임 변경에 실패했습니다.');
    },
  });

  const verifyPasswordMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      verifyPassword(email, password),
    onSuccess: (res) => {
      if (res?.accessToken) {
        setPasswordError('');
        openModal('change-password');
      }
    },
    onError: () => {
      setPasswordError('올바른 비밀번호를 입력해 주세요.');
      Toast.error('비밀번호 인증 실패');
    },
  });

  useEffect(() => {
    if (user?.image) {
      setImage(user.image);
    }
  }, [user?.image]);

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, [user?.nickname]);

  const isSameNickname = () => {
    if (nickname === user?.nickname) {
      setNicknameError('기존 닉네임과 동일합니다.');
      return true;
    }
    return false;
  };

  const handleNicknameUpdate = async () => {
    if (isSameNickname()) return;
    updateNicknameMutation.mutate(nickname);
  };

  const handlePasswordVerification = async () => {
    if (!email) return;
    verifyPasswordMutation.mutate({ email, password });
  };

  return (
    <div className="flex justify-center">
      <div className="mx-4 mt-6 w-full max-w-198 min-w-[343px] md:mx-6 lg:mt-7">
        <div className="flex w-full flex-col items-center">
          <h1 className="text-xl-bold flex w-full flex-col pb-3 text-start">계정설정</h1>
          <div className="flex w-full flex-col gap-6">
            <ProfileImageUploader
              image={image}
              setImage={(newImageUrl: string) => {
                setImage(newImageUrl);
                setUser((prev) => (prev ? { ...prev, image: newImageUrl } : null));
              }}
            />
            <NicknameField
              nickname={nickname}
              nicknameError={nicknameError}
              setNickname={setNickname}
              setNicknameError={setNicknameError}
              onClick={handleNicknameUpdate}
              isLoading={updateNicknameMutation.isPending}
            />
            <FormField field="input" label="이메일" value={email || ''} readOnly />
            <PasswordField
              password={password}
              setPassword={setPassword}
              onClick={handlePasswordVerification}
              isLoading={verifyPasswordMutation.isPending}
              passwordError={passwordError}
              setPasswordError={setPasswordError}
            />
            <button
              type="button"
              className="text-danger text-lg-md flex w-fit items-center gap-1 text-start"
              onClick={() => {
                closeModal('confirm-delete-account');
                openModal('delete-account');
              }}
            >
              <Image src="/icons/secession.svg" width={24} height={24} alt="회원탈퇴 아이콘" />
              회원 탈퇴하기
            </button>
          </div>
        </div>
      </div>
      <ChangePasswordModal onClose={() => {}} />
      <DeleteAccountModal />
      <ConfirmDeleteAccountModal />
    </div>
  );
}
