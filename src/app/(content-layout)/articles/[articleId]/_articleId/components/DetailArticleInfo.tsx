'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DangerModal from '@/components/danger-modal';
import BouncingDots from '@/components/common/loading/BouncingDots';
import { Toast } from '@/components/common/Toastify';
import { GetArticleDetailResponse } from '@/types/article';
import { formatTimeDistance } from '@/utils/date';
import LikeToggleButton from '../../../_articles/components/LikeToggleButton';
import { useUser } from '@/contexts/UserContext';
import useModalContext from '@/components/common/modal/core/useModalContext';
import DetailArticleDropdown from './DetailArticleDropdown';
import axiosClient from '@/lib/axiosClient';

const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_IMAGE;

export default function DetailArticleInfo({ detail }: { detail: GetArticleDetailResponse }) {
  const router = useRouter();
  const { user } = useUser();
  const { openModal } = useModalContext();
  const [isPending, setIsPending] = useState(false);

  const handleArticleDelete = async () => {
    setIsPending(true);
    try {
      await axiosClient.delete(`/articles/${detail.id}`);
      Toast.success('게시글 삭제 성공');
      router.push('/articles');
    } catch {
      Toast.error('게시글 삭제 실패');
    } finally {
      setIsPending(false);
    }
  };

  const isAuthor = user?.id === detail.writer.id;
  const articleModalId = `delete-article-${detail.id}`;

  return (
    <>
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
        {detail.image && detail.image !== DEFAULT_IMAGE && (
          <div className="relative aspect-[1/1] w-full max-w-125 items-center overflow-hidden rounded-2xl md:h-100 md:w-100">
            <Image fill src={detail.image} alt="article-image" />
          </div>
        )}
        <div className="flex w-full flex-1 flex-col gap-12">
          <div>
            <div className="border-border mb-4 flex items-center justify-between border-b pb-4">
              <h1 className="text-lg-md sm:text-2lg-md text-gray300">{detail.title}</h1>
              {isAuthor && (
                <DetailArticleDropdown
                  onEdit={() => router.push(`/articles/${detail.id}/edit`)}
                  onDelete={() => openModal(articleModalId)}
                />
              )}
            </div>
            <div className="text-gray400 text-xs-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/icons/profile-icon.svg" width={32} height={32} alt="profile" />
                <div>
                  <span className="text-gray100 border-bg100 mr-4 border-r pr-4">
                    {detail.writer.nickname}
                  </span>
                  <span>{formatTimeDistance(detail.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Image src="/icons/comment.svg" width={16} height={16} alt="comment" />
                  <span className="text-xs-rg sm:text-md-rg">{detail.commentCount}</span>
                </div>
                <LikeToggleButton
                  articleId={detail.id}
                  likeCount={detail.likeCount}
                  isLiked={detail.isLiked}
                />
              </div>
            </div>
          </div>
          <p className="text-md-rg sm:text-lg-rg text-gray300">{detail.content}</p>
        </div>
      </div>
      <DangerModal
        modalId={articleModalId}
        heading="게시글을 삭제하시겠어요?"
        confirmButton={isPending ? <BouncingDots size={6} /> : '삭제하기'}
        disabled={isPending}
        onConfirm={handleArticleDelete}
      />
    </>
  );
}
