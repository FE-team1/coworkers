'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import ProfileImageUploader from './_mypage/ProfileImageUploader';
import NicknameField from './_mypage/NicknameField';
import PasswordField from './_mypage/PasswordField';
import ChangePasswordModal from '@/components/mypage-modal/ChangePasswordModal';
import DeleteAccountModal from '@/components/mypage-modal/DeleteAccountModal';
import ConfirmDeleteAccountModal from '@/components/mypage-modal/ConfirmDeleteAccountModal';
import axiosClient from '@/lib/axiosClient';
import { getClientCookie, deleteClientCookie } from '@/lib/cookie/client';
import { getUserApiResponse } from '@/types/user';
import useModalContext from '@/components/common/modal/core/useModalContext';
import FormField from '@/components/common/formField';
import { Toast } from '@/components/common/Toastify';

async function fetchUserInfo(): Promise<getUserApiResponse | null> {
  try {
    const token = getClientCookie('accessToken');
    if (!token) {
      deleteClientCookie('accessToken');
      deleteClientCookie('refreshToken');
      return null;
    }

    const response = await axiosClient.get<getUserApiResponse>('/user');
    return response.data;
  } catch (error) {
    console.error('계정 정보 가져오기 실패', error);
    Toast.error('계정 정보를 불러오지 못했습니다. 다시 시도해주세요.');
    return null;
  }
}

export default function MyPage() {
  const [userData, setUserData] = useState<getUserApiResponse | null>(null);
  const [image, setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [password, setPassword] = useState('');
  const { openModal, closeModal } = useModalContext();

  useEffect(() => {
    fetchUserInfo().then((data) => {
      if (data) {
        setUserData(data);
        setImage(data.image || '');
        setNickname(data.nickname || '');
      }
    });
  }, []);

  return (
    <div className="flex justify-center">
      <div className="mx-4 mt-6 w-full max-w-198 min-w-[343px] md:mx-6 lg:mt-7">
        <div className="flex w-full flex-col items-center">
          <h1 className="text-xl-bold flex w-full flex-col pb-3 text-start">계정설정</h1>
          <div className="flex w-full flex-col gap-6">
            <ProfileImageUploader image={image} setImage={setImage} />
            <NicknameField
              nickname={nickname}
              nicknameError={nicknameError}
              setNickname={setNickname}
              setNicknameError={setNicknameError}
              onClick={async () => {
                try {
                  await axiosClient.patch('/user', { nickname });
                  Toast.success('닉네임 변경 성공');
                } catch (error: unknown) {
                  const errorObj = error as { response?: { data?: { message?: string } } };
                  const message = errorObj?.response?.data?.message || '닉네임 변경 실패';
                  setNicknameError(message);
                  Toast.error('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
                }
              }}
            />
            <FormField field="input" label="이메일" value={userData?.email || ''} readOnly />
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
