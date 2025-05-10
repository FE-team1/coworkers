import Image from 'next/image';
import clsx from 'clsx';
import { ModalTrigger } from '@/components/common/modal';
import { Member } from '@/types/user';

type MemberItemProps = {
  member: Member;
  memberDetailModalId: string;
  memberRemovalModalId: string;
  setMemberForDetail: (member: Member) => void;
  setMemberForRemoval: (member: Member) => void;
};

export default function MemberItem({
  member,
  setMemberForDetail,
  setMemberForRemoval,
}: MemberItemProps) {
  const { userName, userImage, userEmail, role } = member;
  const memberDetailModalId = `memberDetail-${member.userId}`;
  const memberRemovalModalId = `memberRemoval-${member.userId}`;

  return (
    <li className="bg-bg200 flex items-center justify-between gap-1.5 rounded-2xl px-4 py-3 md:px-6 md:py-5">
      <ModalTrigger modalId={memberDetailModalId} onClick={() => setMemberForDetail(member)}>
        <div className="flex min-w-0 items-center gap-3">
          <MemberProfileImage
            userImage={userImage}
            userName={userName}
            className="hidden shrink-0 md:block md:size-8"
          />
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <MemberProfileImage
                userImage={userImage}
                userName={userName}
                className="block size-6 shrink-0 md:hidden"
              />
              <div className="text-sm-md truncate">{userName}</div>
            </div>
            <div className="text-xs-rg text-gray300 truncate">{userEmail}</div>
          </div>
        </div>
      </ModalTrigger>
      {role === 'MEMBER' && (
        <ModalTrigger modalId={memberRemovalModalId} onClick={() => setMemberForRemoval(member)}>
          <Image
            width={24}
            height={24}
            src="/icons/x-icon.svg"
            alt="멤버 삭제"
            className="size-4"
          />
        </ModalTrigger>
      )}
    </li>
  );
}

type MemberProfileImageProps = {
  userImage: Member['userImage'];
  userName: Member['userName'];
  className: string;
};

function MemberProfileImage({ userImage, userName, className }: MemberProfileImageProps) {
  return (
    <div className={clsx('relative', className)}>
      {userImage ? (
        <Image
          src={userImage}
          fill
          className="rounded-full object-cover"
          alt={`${userName}님의 프로필 이미지`}
        />
      ) : (
        <Image
          width={24}
          height={24}
          src="/icons/profile-icon.svg"
          alt="기본 프로필 이미지"
          className="size-full"
        />
      )}
    </div>
  );
}
