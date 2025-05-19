'use client';

import Image from 'next/image';
import DropDown from '@/components/common/dropdown';
import { formatTimeDistance } from '@/utils/date';
import { Article } from '../page';
import LikeToggleButton from '../../_articles/components/LikeToggleButton';

const ARTICLE_DROPDOWN_OPTIONS = ['수정하기', '삭제하기'];

export default function DetailArticleInfo({ detail }: { detail: Article }) {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <div className="border-border mb-4 flex items-center justify-between border-b pb-4">
          <h1 className="text-lg-md sm:text-2lg-md text-gray300">{detail.title}</h1>
          <DropDown
            size="md"
            placement="right-0"
            options={ARTICLE_DROPDOWN_OPTIONS}
            onSelect={() => {}}
            dropDownOpenBtn={
              <Image
                src="/icons/kebab-icon.svg"
                width={24}
                height={24}
                alt="kebab"
                className="cursor-pointer"
              />
            }
          />
        </div>
        <div className="text-gray400 text-xs-md flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="border-border relative h-8 w-8 rounded-full border">
              <Image fill src={detail.writer.image} alt="profile" className="rounded-full" />
            </div>
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
            <LikeToggleButton />
          </div>
        </div>
      </div>
      <p className="text-md-rg sm:text-lg-rg text-gray300">{detail.content}</p>
    </div>
  );
}
