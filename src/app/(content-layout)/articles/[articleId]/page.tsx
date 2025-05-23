import { Metadata } from 'next';
import { getDetailArticle, getArticleComments } from './_articleId/action';
import CommentField from './_articleId/components/CommentField';
import CommentList from './_articleId/components/CommentList';
import DetailArticleInfo from './_articleId/components/DetailArticleInfo';
import ScrollTopButton from './_articleId/components/ScrollTopButton';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '자유게시판 | Coworkers',
    description: '자유롭게 게시글을 작성하고 소통할 수 있는 공간입니다.',
  };
}

export default async function DetailArticle({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const articleId = Number((await params).articleId);
  const detail = await getDetailArticle(articleId);
  const initialComments = await getArticleComments(articleId, 10);

  return (
    <div className="relative flex h-full w-full flex-col gap-20">
      <DetailArticleInfo detail={detail} />
      <div className="flex flex-col gap-8 sm:gap-10">
        <CommentField articleId={articleId} />
        <div className="border-border border" />
        <CommentList
          initialComments={initialComments.list}
          initialCursor={initialComments.nextCursor}
          articleId={articleId}
        />
      </div>
      <ScrollTopButton />
    </div>
  );
}
