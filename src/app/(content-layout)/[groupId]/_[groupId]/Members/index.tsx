'use client';
import { useOptimistic, useState, useTransition } from 'react';
import MemberItem from '@/app/(content-layout)/[groupId]/_[groupId]/Members/MemberItem';
import MemberInvitationModal from '@/app/(content-layout)/[groupId]/_[groupId]/Members/MemberInvitationModal';
import MemberRemovalModal from '@/app/(content-layout)/[groupId]/_[groupId]/Members/MemberRemovalModal';
import MemberDetailModal from '@/app/(content-layout)/[groupId]/_[groupId]/Members/MemberDetailModal';
import { removeMemberAction } from '@/app/(content-layout)/[groupId]/_[groupId]/Members/actions';
import { ModalTrigger } from '@/components/common/modal';
import { Member } from '@/types/user';
import { Group } from '@/types/group';

type MembersProps = {
  groupId: Group['id'];
  members: Member[];
};

export default function Members({ groupId, members }: MembersProps) {
  const [memberForDetail, setMemberForDetail] = useState<Member | null>(null);
  const [memberForRemoval, setMemberForRemoval] = useState<Member | null>(null);
  const [optimisticMembers, setOptimisticMembers] = useOptimistic(
    members,
    (currentMembers: Member[], action: Member['userId'] | Member[]) => {
      if (typeof action === 'number') {
        return currentMembers.filter((member) => member.userId !== action);
      }
      return action;
    }
  );
  const [isRemoving, startRemovingTransition] = useTransition();
  const [removalError, setRemovalError] = useState<{ message: string; id: string } | null>(null);

  const removeMember = async (memberToRemove: Member) => {
    startRemovingTransition(async () => {
      setRemovalError(null);
      setOptimisticMembers(memberToRemove.userId);

      const result = await removeMemberAction(groupId, memberToRemove.userId);

      if (result.success) {
        setMemberForRemoval(null);
      } else {
        setOptimisticMembers(members);
        setRemovalError({
          message: result.message,
          id: Date.now().toString(),
        });
      }
    });
  };

  const memberCount = optimisticMembers.length;
  const memberInvitationModalId = `memberInvitation-${groupId}`;
  const memberDetailModalId = memberForDetail ? `memberDetail-${memberForDetail.userId}` : '';
  const memberRemovalModalId = memberForRemoval ? `memberRemoval-${memberForRemoval.userId}` : '';

  return (
    <>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg-md">
            멤버 <span className="text-lg-rg text-gray500">({memberCount}명)</span>
          </h2>
          <ModalTrigger className="text-primary" modalId={memberInvitationModalId}>
            + 새로운 멤버 초대하기
          </ModalTrigger>
        </div>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {optimisticMembers.map((member) => (
            <MemberItem
              key={member.userId}
              member={member}
              memberDetailModalId={memberDetailModalId}
              memberRemovalModalId={memberRemovalModalId}
              setMemberForDetail={setMemberForDetail}
              setMemberForRemoval={setMemberForRemoval}
            />
          ))}
        </ul>
      </section>

      <MemberInvitationModal modalId={memberInvitationModalId} groupId={groupId} />

      {memberForDetail && (
        <MemberDetailModal modalId={memberDetailModalId} member={memberForDetail} />
      )}

      {memberForRemoval && (
        <MemberRemovalModal
          member={memberForRemoval}
          modalId={memberRemovalModalId}
          isRemoving={isRemoving}
          error={removalError}
          removeMember={() => removeMember(memberForRemoval)}
        />
      )}
    </>
  );
}
