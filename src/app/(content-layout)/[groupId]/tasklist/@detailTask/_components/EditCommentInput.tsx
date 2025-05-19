'use client';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/formField/compound/Textarea';
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
    <div className="flex flex-col items-end gap-2 pb-4">
      <Textarea
        className={clsx('h-fit min-h-8 w-full resize-none')}
        value={currentContent}
        onChange={onChange}
        name="content"
        isBorder={false}
        height={40}
      />
      <div className="flex gap-2">
        <button className="text-gray500 text-sm-semi" onClick={onEditCancel}>
          취소
        </button>
        <Button
          onClick={editComment}
          variant="ghost-primary"
          size="xs"
          fontSize="14"
          disabled={currentContent.trim() === ''}
        >
          수정하기
        </Button>
      </div>
    </div>
  );
}
