'use client';

import CommentItem from '@/components/comment';
import { ArticleComment } from '@/components/comment/types';

export default function CommentList({ comments }: { comments: ArticleComment[] }) {
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onEdit={() => {}} onDelete={() => {}} />
      ))}
    </div>
  );
}
