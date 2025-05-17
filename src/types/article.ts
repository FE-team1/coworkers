export interface ArticleWriter {
  id: number;
  nickname: string;
  image: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount?: number;
  writer: ArticleWriter;
  isLiked: boolean;
}

/**
 * 게시글 목록 조회 API 응답 타입
 * GET /{teamId}/articles
 */
export interface GetArticlesResponse {
  totalCount: number;
  list: Article[];
}

/**
 * 게시글 상세 조회 API 응답 타입
 * GET /{teamId}/articles/{articleId}
 */
export interface GetArticleDetailResponse extends Article {
  isLiked: boolean; // 현재 로그인한 사용자가 좋아요를 눌렀는지 여부
}
