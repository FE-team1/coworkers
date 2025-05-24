import DropDown from '@/components/common/dropdown';
import Image from 'next/image';

const ARTICLE_DROPDOWN_OPTIONS = ['수정하기', '삭제하기'];

export default function DetailArticleDropdown({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const onDropdownListClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const option = e.currentTarget.textContent;

    if (option === '수정하기') return onEdit();
    if (option === '삭제하기') return onDelete();
  };

  return (
    <DropDown
      size="md"
      placement="right-0"
      options={ARTICLE_DROPDOWN_OPTIONS}
      onSelect={onDropdownListClick}
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
  );
}
