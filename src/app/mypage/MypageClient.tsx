'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { updateUserNickname } from './_mypage/action';
import ProfileImageUploader from './_mypage/ProfileImageUploader';
import NicknameField from './_mypage/NicknameField';
import PasswordField from './_mypage/PasswordField';
import { Toast } from '@/components/common/Toastify';
import ChangePasswordModal from './_mypage/mypage-modal/ChangePasswordModal';
import DeleteAccountModal from './_mypage/mypage-modal/DeleteAccountModal';
import ConfirmDeleteAccountModal from './_mypage/mypage-modal/ConfirmDeleteAccountModal';
import useModalContext from '@/components/common/modal/core/useModalContext';
import FormField from '@/components/common/formField';
import { useUser } from '@/contexts/UserContext';

export default function MyPageClient() {
  const { user, email, fetchUser, setUser } = useUser();
  const [image, setImage] = useState(user?.image ?? '');
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const { openModal, closeModal } = useModalContext();

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
              onClick={async () => {
                if (isSameNickname()) return;
                try {
                  await updateUserNickname(nickname);
                  await fetchUser();
                  Toast.success('닉네임 변경 성공');
                } catch (error: unknown) {
                  const errorObj = error as { response?: { data?: { message?: string } } };
                  const message =
                    errorObj?.response?.data?.message || '닉네임을 변경할 수 없습니다.';
                  setNicknameError(message);
                  Toast.error('닉네임 변경에 실패했습니다.');
                }
              }}
            />
            <FormField field="input" label="이메일" value={email || ''} readOnly />
            <PasswordField
              password={password}
              setPassword={setPassword}
              onClick={() => openModal('change-password')}
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
