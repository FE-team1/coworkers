'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Card from './_articles/components/Card';
import BestCard from './_articles/components/BestCard';
import SortToggle from './_articles/components/SortToggle';
import ArticleSearchBar from './_articles/components/ArticleSearchBar';
import Pagination from './_articles/components/Pagination';
import { Article, GetArticlesResponse } from '@/types/article';
import axiosClient from '@/lib/axiosClient';
import PATHS from '@/constants/paths';
import { Toast } from '@/components/common/Toastify';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [bestArticles, setBestArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0); // 총 몇 페이지를 만들지 계산할 때 사용
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState<'recent' | 'like'>('recent');
  const [myArticlesOnly, setMyArticlesOnly] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    // 베스트 게시글 불러오기
    const fetchBestArticles = async () => {
      try {
        const res = await axiosClient.get<GetArticlesResponse>('/articles', {
          params: {
            page: 1,
            pageSize: 100,
            orderBy: 'like',
          },
        });
        const sortedByLike = res.data.list.sort((a, b) => b.likeCount - a.likeCount);
        setBestArticles(sortedByLike.slice(0, 3));
      } catch (error) {
        Toast.error('베스트 게시글을 불러오는 데 실패했습니다.');
        console.error('베스트 게시글을 불러오기 실패', error);
      }
    };
    fetchBestArticles();
  }, []);

  useEffect(() => {
    // 조건에 따른 일반 게시글 불러오기
    const fetchArticles = async () => {
      try {
        const res = await axiosClient.get('/articles', {
          params: {
            page: currentPage,
            pageSize,
            orderBy,
            searchKeyword,
          },
        });

        const allArticles = res.data.list;
        const storedUserId = localStorage.getItem('userId');
        const userId = storedUserId ? parseInt(storedUserId, 10) : null;
        let filtered = allArticles;
        if (myArticlesOnly && userId) {
          // 내 게시글만 보기
          filtered = filtered.filter((article: Article) => article.writer.id === userId);
        }
        if (searchKeyword.trim()) {
          // 키워드로 검색한 게시글 보기
          const lowerKeyword = searchKeyword.toLowerCase();
          filtered = filtered.filter((article: Article) =>
            article.title.toLowerCase().includes(lowerKeyword)
          );
        }
        setArticles(filtered);
        setTotalCount(res.data.totalCount);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        Toast.error('게시글을 불러오는 데 실패했습니다.');
      }
    };
    fetchArticles();
  }, [currentPage, orderBy, myArticlesOnly, searchKeyword]);

  return (
    <main className="">
      <section className="flex flex-col gap-10 pb-10">
        <h1 className="text-2xl-bold">자유게시판</h1>
        <ArticleSearchBar value={searchKeyword} onChange={setSearchKeyword} />
      </section>

      <section className="border-bg200 flex flex-col gap-14 border-b pb-10">
        <div className="flex justify-between">
          <h2 className="text-xl-bold">베스트 게시글</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bestArticles.slice(0, 1).map((article) => (
            <BestCard key={`sm-${article.id}`} {...article} className="block md:hidden" />
          ))}
          {bestArticles.slice(0, 2).map((article) => (
            <BestCard key={`md-${article.id}`} {...article} className="hidden md:block lg:hidden" />
          ))}
          {bestArticles.slice(0, 3).map((article) => (
            <BestCard key={`lg-${article.id}`} {...article} className="hidden lg:block" />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-8 pt-10">
        <div className="flex items-start justify-between">
          <h2 className="text-xl-bold">게시글</h2>
          <div className="flex items-center gap-4">
            <Button
              className="text-md-md px-2"
              variant="ghost-primary"
              size="fullWidth"
              onClick={() => {
                setMyArticlesOnly((prev) => !prev);
                setCurrentPage(1); // 조건이 바뀔 때마다 현재 페이지를 1페이지로 리셋
              }}
            >
              {myArticlesOnly ? '전체 게시글 보기' : '내 게시글 보기'}
            </Button>
            <SortToggle
              onSelect={(selected) => {
                const apiValue = selected === '최신순' ? 'recent' : 'like';
                setOrderBy(apiValue);
                setCurrentPage(1); // 조건이 바뀔 때마다 현재 페이지를 1페이지로 리셋
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {articles.map((article) => (
            <Card
              key={article.id}
              {...article}
              title={article.title.length > 30 ? article.title.slice(0, 30) + '...' : article.title}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)}
          onPageChange={setCurrentPage}
        />
      </section>

      <Button
        onClick={() => router.push(`${PATHS.ARTICLES.NEW}`)}
        className="fixed right-6 bottom-6"
      >
        + 글쓰기
      </Button>
    </main>
  );
}
