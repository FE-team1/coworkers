import { Suspense, use } from 'react';
import ResetPasswordForm from './_reset-password/components/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '비밀번호 재설정 | Coworkers',
  description: 'Coworkers 비밀번호 재설정 하기',
};

interface Props {
  searchParams: Promise<{ [token: string]: string | string[] | undefined }>;
}
export default function ResetPasswordPage({ searchParams }: Props) {
  const { token } = use(searchParams);

  return (
    <div className="flex flex-col gap-6 text-center md:gap-20">
      <p className="text-2xl-md lg:text-4xl">비밀번호 재설정</p>
      <Suspense fallback={<div>로딩스피너 들어갈 영역</div>}>
        <ResetPasswordForm token={token} />
      </Suspense>
    </div>
  );
}
