import Link from 'next/link';
import kebabIcon from '@/../public/icons/kebab-icon.svg';
import Image from 'next/image';

interface GroupOptionProps {
  group: {
    teamId: string;
    updatedAt: string;
    createdAt: string;
    image: string;
    name: string;
    id: number;
  };
}

export default function DropDownGroupsItem({ group }: GroupOptionProps) {
  const { name, image, id } = group;

  return (
    <div className="hover:bg-bg100 flex h-[46px] w-[186px] cursor-pointer items-center justify-between rounded-lg px-2">
      <Link
        href={`/${id}`}
        className="text-lg-md text-gray400 flex items-center gap-3"
        data-group-id={id}
      >
        <Image
          src={image}
          width={32}
          height={32}
          alt="이미지"
          className="h-[32px] w-[32px] rounded-md object-cover"
        />
        <span className="w-[110px] truncate">{name}</span>
      </Link>
      <Link href={`/${id}/editgroup`}>
        <Image width={16} height={16} src={kebabIcon} alt=":" />
      </Link>
    </div>
  );
}
