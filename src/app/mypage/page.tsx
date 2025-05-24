import { Metadata } from 'next';
import MyPageClient from './MypageClient';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: '계정관리 | Coworkers',
    openGraph: {
      title: '계정관리 | Coworkers',
      description: '자유롭게 게시글을 작성하고 소통할 수 있는 공간입니다.',
      siteName: 'Coworkers',
    },
  };
};

export default function Page() {
  return <MyPageClient />;
}
