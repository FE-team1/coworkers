'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toast } from '@/components/common/Toastify';
import DangerModal from '@/components/danger-modal';
import BouncingDots from '@/components/common/loading/BouncingDots';
import { useModal } from '@/contexts/ModalContext';
import TrashCan from '@/assets/TrashCan';
import { deleteGroup } from '../action';
import { useUser } from '@/contexts/UserContext';

export default function DeleteGroupButton({ groupId }: { groupId: number }) {
  const [isPending, setIsPending] = useState(false);
  const { openModal } = useModal();
  const { fetchUser } = useUser();
  const router = useRouter();

  const handleDeleteGroup = () => {
    setIsPending(true);

    deleteGroup(groupId)
      .then(() => {
        fetchUser();
        Toast.success('팀 삭제 성공');
        router.push('/');
      })
      .catch(() => Toast.error('팀 삭제 실패'))
      .finally(() => setIsPending(false));
  };

  const deleteModalId = `delete-group-${groupId}`;

  return (
    <>
      <button
        onClick={() => openModal(deleteModalId)}
        className="text-danger text-lg-md flex w-fit cursor-pointer items-center justify-start gap-2"
      >
        <TrashCan />
        <span>팀 삭제하기</span>
      </button>
      <DangerModal
        modalId={deleteModalId}
        heading="팀 삭제를 진행하시겠어요?"
        confirmButton={isPending ? <BouncingDots /> : '삭제하기'}
        onConfirm={handleDeleteGroup}
        disabled={isPending}
      />
    </>
  );
}
