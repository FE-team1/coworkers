'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import { Toast } from '@/components/common/Toastify';

export default function JoinGroup() {
  const [inviteLink, setInviteLink] = useState('');
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = inviteLink.trim();
    const userEmail = localStorage.getItem('userEmail') ?? '';
    try {
      const response = await axiosClient.post('/groups/accept-invitation', {
        userEmail,
        token,
      });
      Toast.success('팀 참여 성공!');
      const groupId = response.data.groupId;
      setTimeout(() => {
        router.push(`/${groupId}`);
      }, 1000);
    } catch (error) {
      Toast.error('팀 참여에 실패했습니다. 링크를 다시 확인해주세요.');
      console.error('팀 참여 실패:', error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-20">
      <h1 className="text-4xl">팀 참여하기</h1>
      <form className="flex w-full flex-col gap-10" onSubmit={handleJoin}>
        <div className="flex w-full flex-col">
          <FormField
            field="input"
            label="팀 링크"
            placeholder="팀 링크를 입력해주세요."
            value={inviteLink}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteLink(e.target.value)}
            isFailure={inviteLink.trim() === ''}
            errorMessage={inviteLink.trim() === '' ? '팀 링크를 입력해주세요.' : ''}
          />
        </div>
        <div className="flex flex-col gap-6">
          <Button
            type="submit"
            variant="solid"
            size="fullWidth"
            disabled={inviteLink.trim() === ''}
          >
            참여하기
          </Button>
          <p className="text-lg-rg text-gray500 text-center">
            공유받은 팀 링크를 입력해 참여할 수 있어요.
          </p>
        </div>
      </form>
    </div>
  );
}
