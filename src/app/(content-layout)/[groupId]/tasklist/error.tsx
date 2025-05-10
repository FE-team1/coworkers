'use client';

import { useEffect } from 'react';

interface Props {
  error: Error;
}
export default function TaskListPageFallBack({ error }: Props) {
  useEffect(() => {
    console.error(error.message);
  }, [error]);
  return (
    <div className="flex w-full justify-center px-10">
      <h2>오류가 발생했습니다.</h2>
    </div>
  );
}
