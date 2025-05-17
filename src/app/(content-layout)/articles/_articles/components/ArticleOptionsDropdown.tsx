import Image from 'next/image';
import DropDown from '@/components/common/dropdown';

export default function ArticleOptionsDropdown() {
  return (
    <DropDown
      options={['수정하기', '삭제하기']}
      size="md"
      placement=" right-0"
      onSelect={(e) => {
        const selected = e.currentTarget.textContent;
        if (selected === '수정하기') {
          // TODO: 수정하기
        } else if (selected === '삭제하기') {
          // TODO: 삭제하기
        }
      }}
      dropDownOpenBtn={
        <Image
          width={24}
          height={24}
          src="icons/kebab-icon.svg"
          alt="옵션"
          className="cursor-pointer"
        />
      }
    />
  );
}
