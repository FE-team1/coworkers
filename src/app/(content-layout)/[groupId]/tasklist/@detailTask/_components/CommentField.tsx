'use client';
import CommentItem from '@/components/comment';
import { Comment } from '@/components/comment/types';
import { useState } from 'react';
import EditCommentInput from './EditCommentInput';
import axiosClient from '@/lib/axiosClient';
import useModalContext from '@/components/common/modal/core/useModalContext';
import RemoveCommentModal from '../../_tasklist/components/ModalContents/RemoveCommentModal';
import { Toast } from '@/components/common/Toastify';

interface Props {
  comment: Comment;
  taskId: number;
}

export default function CommentField({ comment, taskId }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { openModal } = useModalContext();
  const [currentComment, setCurrentComment] = useState(comment);
  const [currentContent, setCurrentContent] = useState(comment.content);

  const deleteCommentModalId = `${comment.id}-delete-comment`;

  const onEdit = () => {
    setIsEdit(true);
  };
  const onEditCancel = () => {
    setIsEdit(false);
  };

  const deleteComment = async () => {
    try {
      await axiosClient.delete(`/tasks/${taskId}/comments/${comment.id}`);
      setIsDelete(true);
      Toast.success('댓글을 삭제했습니다.');
    } catch {
      Toast.error('댓글 삭제에 실패 했습니다.');
    }
  };

  const deleteCommentModalPopUp = () => {
    openModal(deleteCommentModalId);
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.currentTarget.value);
  };

  const editComment = async () => {
    try {
      await axiosClient.patch(`/tasks/${taskId}/comments/${comment.id}`, {
        content: currentContent,
      });
      setCurrentComment((prev) => ({ ...prev, content: currentContent }));
      onEditCancel();
    } catch (err) {
      console.error(err);
      Toast.error('댓글 수정에 실패 했습니다.');
    }
  };

  return (
    <>
      {isEdit ? (
        <EditCommentInput
          editComment={editComment}
          onChange={handleChangeComment}
          onEditCancel={onEditCancel}
          currentContent={currentContent}
        />
      ) : (
        <>
          {!isDelete && (
            <>
              <CommentItem
                key={comment.id}
                comment={currentComment}
                onDelete={deleteCommentModalPopUp}
                onEdit={onEdit}
              />
              <RemoveCommentModal modalId={deleteCommentModalId} onDelete={deleteComment} />
            </>
          )}
        </>
      )}
    </>
  );
}
