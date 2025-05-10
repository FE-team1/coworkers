'use client';

import Button from '@/components/common/Button';
import PATHS from '@/constants/paths';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  error: Error;
  reset: () => void;
}
export default function ResetPasswordError({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    console.error(error.message);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-84px)] w-full flex-col items-center gap-6">
      <h2>비밀번호 변경에 실패 했습니다.</h2>
      <div className="flex w-full gap-2">
        <Button variant="outline-primary" size="fullWidth" onClick={() => reset()}>
          다시시도 하기
        </Button>
        <Button size="fullWidth" onClick={() => router.push(PATHS.HOME)}>
          홈으로 가기
        </Button>
      </div>
    </div>
  );
}
