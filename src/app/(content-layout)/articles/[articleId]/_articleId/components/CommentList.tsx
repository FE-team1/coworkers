'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Textarea from '@/components/common/formField/compound/Textarea';
import Button from '@/components/common/Button';
import DangerModal from '@/components/danger-modal';
import { Toast } from '@/components/common/Toastify';
import CommentItem from '@/components/comment';
import BouncingDots from '@/components/common/loading/BouncingDots';
import { useModal } from '@/contexts/ModalContext';
import { ArticleComment, ArticleComments } from '@/components/comment/types';
import { deleteArticleComment, getArticleComments, patchArticleComment } from '../action';
import { validateEmptyValue } from '@/utils/validators';

export default function CommentList({
  initialComments,
  initialCursor,
  articleId,
}: {
  initialComments: ArticleComments['list'];
  initialCursor: ArticleComments['nextCursor'];
  articleId: number;
}) {
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(null);
  const [commentToEdit, setCommentToEdit] = useState<{ id: number; content: string } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { openModal } = useModal();

  const [ref, inView] = useInView({ threshold: 1.0 });
  const [moreComments, setMoreComments] = useState<ArticleComment[]>([]);
  const [cursor, setCursor] = useState<number | null>(initialCursor);
  const [isScrollLoading, setIsScrollLoading] = useState(false);
  const hasMore = cursor !== null;

  const getMoreComment = async () => {
    if (!hasMore || isScrollLoading) return;

    setIsScrollLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 200));

      const { list, nextCursor } = await getArticleComments(articleId, 5, cursor);
      setMoreComments((prev) => [...prev, ...list]);
      setCursor(nextCursor);
    } catch {
      Toast.error('댓글 불러오기 실패');
    } finally {
      setIsScrollLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      getMoreComment();
    }
  }, [inView]);

  const deleteComment = () => {
    if (commentIdToDelete === null) return;

    setIsPending(true);

    deleteArticleComment(articleId, commentIdToDelete)
      .then(() => setCommentIdToDelete(null))
      .catch(() => Toast.error('댓글 삭제 실패'))
      .finally(() => setIsPending(false));
  };

  const editComment = (commentId: number, comment: string, editComment: string) => {
    if (commentToEdit === null) return;

    if (comment === editComment) {
      Toast.info('변경 사항이 없습니다');
      return;
    }

    setIsPending(true);

    patchArticleComment(articleId, commentId, editComment)
      .then(() => setCommentToEdit(null))
      .catch(() => Toast.error('댓글 수정 실패'))
      .finally(() => setIsPending(false));
  };

  const deleteCommentModalId = `delete-comment-${commentIdToDelete}`;

  const allComments = [...initialComments, ...moreComments];

  if (allComments.length === 0) {
    return (
      <div className="flex h-full w-full justify-center pt-37 sm:pt-[126px]">
        <span className="text-lg-md text-gray500">아직 작성된 댓글이 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="mb-10 flex w-full flex-col items-center gap-4">
      {allComments.map((comment) => {
        const isEdit = commentToEdit?.id === comment.id;

        return (
          <div key={comment.id} className="w-full">
            {isEdit ? (
              <div className="bg-bg200 flex flex-col rounded-lg p-4 md:px-6 md:py-5">
                <Textarea
                  value={commentToEdit?.content}
                  onChange={(e) => {
                    setCommentToEdit((prev) =>
                      prev ? { ...prev, content: e.target.value } : prev
                    );
                  }}
                  isBorder={false}
                  height={56}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setCommentToEdit(null)}
                    className="text-gray500 text-md-semi w-fit px-3"
                  >
                    취소
                  </button>
                  <Button
                    onClick={() => editComment(comment.id, comment.content, commentToEdit.content)}
                    disabled={isPending || validateEmptyValue(commentToEdit?.content)}
                    size="xs"
                    variant="ghost-primary"
                    fontSize="14"
                  >
                    {isPending ? <BouncingDots size={5} /> : '수정하기'}
                  </Button>
                </div>
              </div>
            ) : (
              <CommentItem
                key={comment.id}
                comment={comment}
                onEdit={() => setCommentToEdit({ id: comment.id, content: comment.content })}
                onDelete={() => openModal(deleteCommentModalId)}
                checkDropdownOpen={() => setCommentIdToDelete(comment.id)}
              />
            )}
          </div>
        );
      })}
      {isScrollLoading && (
        <div className="mt-5">
          <BouncingDots backgroundColor="bg-primary" />
        </div>
      )}
      {hasMore && <div ref={ref} className="h-20" />}
      <DangerModal
        modalId={deleteCommentModalId}
        heading="댓글을 삭제하시겠어요?"
        confirmButton={isPending ? <BouncingDots size={7} /> : '삭제하기'}
        onConfirm={deleteComment}
        disabled={isPending}
      />
    </div>
  );
}
