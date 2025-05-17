import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';

export default function CommentField() {
  return (
    <div className="flex flex-col items-end gap-4">
      <FormField
        field="textarea"
        label="댓글달기"
        placeholder="댓글을 입력해 주세요."
        gapSize="24"
        height={104}
      />
      <Button variant="solid" size="xs" className="sm:h-12 sm:w-46">
        등록
      </Button>
    </div>
  );
}
