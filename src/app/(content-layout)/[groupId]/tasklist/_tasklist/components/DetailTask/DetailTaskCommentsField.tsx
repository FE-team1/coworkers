'use client';
import CommentSlot from '@/assets/CommentSlot';
import { Comment } from '@/components/comment/types';
import Textarea from '@/components/common/formField/compound/Textarea';
import axiosClient from '@/lib/axiosClient';
import { useEffect, useState } from 'react';
import CommentField from './CommentField';

//color 변경

interface Props {
  taskId: number;
}
export default function DetailTaskCommentField({ taskId }: Props) {
  const [commentValue, setCommentValue] = useState('');
  const [currentComments, setCurrentComments] = useState<Comment[]>([]);
  const fetchComments = async () => {
    const { data } = await axiosClient(`/tasks/${taskId}/comments`);
    setCurrentComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.currentTarget.value);
  };

  const handleSubmitComment = async () => {
    const { data } = await axiosClient.post(`/tasks/${taskId}/comments`, { content: commentValue });
    setCurrentComments((prev) => [...prev, data]);
    setCommentValue('');
    //댓글 등록 실패시 에러 핸들링 필요
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-border border-t-1 border-b-1 py-3">
        <Textarea
          rightSlot={
            <CommentSlot
              className="text-primary mt-1.5 mr-1.5 cursor-pointer"
              onClick={handleSubmitComment}
              color="#10b981"
            />
          }
          className="text-md-rg h-fit min-h-8 pr-8"
          isBorder={false}
          onChange={handleChangeComment}
          placeholder="댓글을 달아주세요"
          value={commentValue}
        />
      </div>
      <div className="flex flex-col gap-4">
        {currentComments.map((comment: Comment) => {
          return <CommentField key={comment.id} comment={comment} taskId={taskId} />;
        })}
      </div>
    </div>
  );
}
