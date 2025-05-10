'use client';
import Button from '@/components/common/Button';
import { COMMON_TEXTFIELD_STYLE } from '@/components/common/formField/style';
import clsx from 'clsx';

interface Props {
  onEditCancel: () => void;
  currentContent: string;
  editComment: () => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function EditCommentInput({
  editComment,
  onChange,
  currentContent,
  onEditCancel,
}: Props) {
  return (
    <div className="relative flex flex-col pb-4">
      <textarea
        className={(clsx('h-fit min-h-8 w-full resize-none'), COMMON_TEXTFIELD_STYLE)}
        value={currentContent}
        onChange={onChange}
        name="content"
      />
      <div className="absolute right-0 bottom-0 flex gap-2">
        <button className="text-gray500 text-sm-semi" onClick={onEditCancel}>
          취소
        </button>
        <Button onClick={editComment} variant="ghost-primary" size="xs" fontSize="14">
          수정하기
        </Button>
      </div>
    </div>
  );
}
