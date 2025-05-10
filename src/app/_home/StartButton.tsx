'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import axiosClient from '@/lib/axiosClient';
import PATHS from '@/constants/paths';
import { getUserApiResponse } from '@/types/user';

// @FIXME: 1. 유저 정보를 전역 상태로 관리해서, 요청 수 줄이기  2 href를 state로 관리 + Link 컴포넌트 사용
export default function StartButton({
  className,
  children,
  ...props
}: React.ComponentProps<'button'>) {
  const router = useRouter();
  const handleClick = async () => {
    const res = await axiosClient.get<getUserApiResponse>(`/user`);

    const memberships = res.data?.memberships || [];

    router.push(
      memberships.length > 0 ? `${PATHS.getGroupPath(memberships[0].groupId)}` : `${PATHS.NOGROUP}`
    );
  };

  return (
    <Button
      variant="gradient"
      fontSize="16"
      size="xl"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
