import Image from 'next/image';
import clsx from 'clsx';
import { User } from '@/types/user';

export interface ProfileBadgeProps {
  user: User;
  width?: number | `${number}`;
  height?: number | `${number}`;
  className?: string;
}

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_IMAGE;

export default function ProfileBadge({
  user,
  width = 32,
  height = 32,
  className = '',
}: ProfileBadgeProps) {
  if (!user) return;

  const isBasicProfile = user.image === DEFAULT_IMAGE;

  return (
    <div className={clsx(`flex shrink-0 items-center gap-3`, className)}>
      <div
        className={clsx(
          'rounded-full',
          isBasicProfile ? 'static' : 'border-border relative border'
        )}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <Image
          src={isBasicProfile ? '/icons/profile-icon.svg' : (user.image as string)}
          alt="profile"
          width={isBasicProfile ? width : undefined}
          height={isBasicProfile ? height : undefined}
          fill={!isBasicProfile}
          className={clsx(!isBasicProfile && 'rounded-full object-cover')}
        />
      </div>
      <div className="text-md-md">{user.nickname}</div>
    </div>
  );
}
