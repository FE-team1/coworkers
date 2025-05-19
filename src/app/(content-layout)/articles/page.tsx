'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Card from './_articles/components/Card';
import BestCard from './_articles/components/BestCard';
import SortToggle from './_articles/components/SortToggle';
import ArticleSearchBar from './_articles/components/ArticleSearchBar';
import { Article } from '@/types/article';
import PATHS from '@/constants/paths';

const mockArticles: Article[] = [
  {
    id: 1,
    title: '게시글 제목입니다.',
    content: '게시글 내용입니다.',
    image:
      'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    createdAt: '2025-05-09T02:40:12.877Z',
    updatedAt: '2025-05-09T02:40:12.877Z',
    likeCount: 200,
    writer: {
      id: 1,
      nickname: '홍길동',
      image: '',
    },
  },
  {
    id: 2,
    title: '게시글 제목입니다.',
    content: '게시글 내용입니다.',
    image:
      'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    createdAt: '2025-05-09T02:40:12.877Z',
    updatedAt: '2025-05-09T02:40:12.877Z',
    likeCount: 9999,
    writer: {
      id: 1,
      nickname: '홍길동',
      image: '',
    },
  },
  {
    id: 3,
    title: '게시글 제목입니다.',
    content: '게시글 내용입니다.',
    image:
      'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    createdAt: '2025-05-09T02:40:12.877Z',
    updatedAt: '2025-05-09T02:40:12.877Z',
    likeCount: 300,
    writer: {
      id: 1,
      nickname: '홍길동',
      image: '',
    },
  },
  {
    id: 4,
    title: '게시글 제목입니다.',
    content: '게시글 내용입니다.',
    image:
      'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    createdAt: '2025-05-09T02:40:12.877Z',
    updatedAt: '2025-05-09T02:40:12.877Z',
    likeCount: 123,
    writer: {
      id: 1,
      nickname: '홍길동',
      image: '',
    },
  },
  {
    id: 5,
    title: '게시글 제목입니다.',
    content: '게시글 내용입니다.',
    image:
      'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    createdAt: '2025-05-09T02:40:12.877Z',
    updatedAt: '2025-05-09T02:40:12.877Z',
    likeCount: 123,
    writer: {
      id: 1,
      nickname: '홍길동',
      image: '',
    },
  },
  {
    id: 6,
    title: '게시글 제목입니다.',
    content: '게시글 내용입니다.',
    image:
      'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    createdAt: '2025-05-09T02:40:12.877Z',
    updatedAt: '2025-05-09T02:40:12.877Z',
    likeCount: 123,
    writer: {
      id: 1,
      nickname: '홍길동',
      image: '',
    },
  },
];

export default function ArticlesPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const bestArticles = [...mockArticles].sort((a, b) => b.likeCount - a.likeCount).slice(0, 3);
  const router = useRouter();

  return (
    <main className="">
      <section className="flex flex-col gap-10 pb-10">
        <h1 className="text-2xl-bold">자유게시판</h1>
        <ArticleSearchBar value={searchKeyword} onChange={setSearchKeyword} />
      </section>

      <section className="border-bg200 flex flex-col gap-14 border-b pb-10">
        <div className="flex justify-between">
          <h2 className="text-xl-bold">베스트 게시글</h2>
          <button type="button" className="text-md-rg text-gray400">
            더보기 &gt;
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bestArticles.map((article) => (
            <BestCard key={article.id} {...article} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-8 pt-10">
        <div className="flex items-start justify-between">
          <h2 className="text-xl-bold">게시글</h2>
          <div className="flex items-center gap-4">
            <Button className="text-md-md px-2" variant="ghost-primary" size="fullWidth">
              내 게시글 보기
            </Button>
            <SortToggle onSelect={() => {}} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {mockArticles.map((article) => (
            <Card key={article.id} {...article} />
          ))}
        </div>
      </section>

      <Button
        onClick={() => router.push(`${PATHS.ARTICLES.NEW}`)}
        className="fixed right-6 bottom-6"
      >
        {/* 나중에 게시글 생성하기 주소에 맞게 수정 필요 */}+ 글쓰기
      </Button>
    </main>
  );
}
