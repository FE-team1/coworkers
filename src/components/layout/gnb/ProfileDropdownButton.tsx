'use client';

import Image from 'next/image';
import DropDown from '@/components/common/dropdown';
import DropDownProfileItemList from '@/components/common/dropdown/ProfileItem';
import { getUserApiResponse } from '@/types/user';

interface Props {
  userData: getUserApiResponse;
}

export default function ProfileDropdownButton({ userData }: Props) {
  const userName = userData.nickname;

  return (
    <DropDown
      size="lg"
      placement="top-11 -right-0"
      dropDownOpenBtn={
        <button type="button" className="flex items-center gap-2">
          {userData.image ? (
            <div className="relative h-6 w-6">
              <Image
                src={userData.image}
                alt="유저 이미지"
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <Image src="/icons/user.svg" alt="유저 아이콘" width={24} height={24} />
          )}
          <span className="text-md-md hidden lg:inline">{userName}</span>
        </button>
      }
      options={DropDownProfileItemList}
      onSelect={() => {}}
    />
  );
}
