import CommentField from './_articleId/CommentField';
import CommentList from './_articleId/CommentList';
import DetailArticleInfo from './_articleId/DetailArticleInfo';

interface ArticleWriter {
  id: number;
  nickname: string;
  image: string;
}

export interface Article {
  id: number;
  title: string;
  content?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount?: number;
  writer: ArticleWriter;
  isLiked: boolean;
}

export default function DetailArticle() {
  const detail = {
    id: 0,
    title: 'title',
    content: 'content',
    image:
      'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    createdAt: '2025-05-14T10:00:00Z',
    updatedAt: '2025-05-14T10:00:00Z',
    likeCount: 0,
    commentCount: 0,
    writer: {
      id: 0,
      nickname: 'nickname',
      image:
        'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
    },
    isLiked: false,
  };

  const articleComments = [
    {
      id: 1,
      content: '첫 번째 댓글',
      createdAt: '2025-05-14T10:00:00Z',
      updatedAt: '2025-05-14T10:00:00Z',
      writer: {
        id: 11,
        nickname: '유선향',
        image:
          'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/IMG_0249.jpeg',
      },
    },
    {
      id: 2,
      content: '두 번째 댓글',
      createdAt: '2025-05-14T10:05:00Z',
      updatedAt: '2025-05-14T10:05:00Z',
      writer: {
        id: 22,
        nickname: '황혜진',
        image:
          'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/이미지 2024. 1. 12. 15.07.jpeg',
      },
    },
    {
      id: 3,
      content: '세 번째 댓글',
      createdAt: '2025-05-14T10:10:00Z',
      updatedAt: '2025-05-14T10:15:00Z',
      writer: {
        id: 33,
        nickname: '강석준',
        image:
          'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Coworkers/user/1844/IMG_3867.jpeg',
      },
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-20">
      <DetailArticleInfo detail={detail} />
      <div className="flex flex-col gap-8 sm:gap-10">
        <CommentField />
        <div className="border-border border" />
        <CommentList comments={articleComments} />
      </div>
    </div>
  );
}
