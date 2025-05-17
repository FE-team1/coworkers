'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import CoworkersLogo from '@/assets/CoworkersLogo';
import Input from '@/components/common/formField/compound/Input';
import Button from '@/components/common/Button';

interface Group {
  id: number;
  name: string;
}

interface SideMenuProps {
  groups: Group[];
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = forwardRef<HTMLDivElement, SideMenuProps>(({ groups, isOpen, onClose }, ref) => {
  const pathname = usePathname();
  const selectedGroupId = pathname.split('/')[1];
  const [filteredGroups, setFilteredGroups] = useState<Group[]>(groups);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    setFilteredGroups(groups);
  }, [groups]);

  useEffect(() => {
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [searchKeyword, groups]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />}

      <div
        ref={ref}
        className={clsx(
          'bg-bg200 fixed top-0 left-0 z-300 flex h-screen w-51 transform flex-col gap-6 overflow-scroll p-4 pb-10 shadow-lg transition-transform duration-500',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <CoworkersLogo className="w-25" />
          <button type="button" onClick={onClose} className="cursor-pointer" title="닫기">
            <Image src="/icons/close.svg" alt="닫기" width={24} height={24} />
          </button>
        </div>

        <div className="border-border flex flex-col gap-6 border-b pb-6">
          <Input
            placeholder="팀 이름 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            leftSlot={<Image src="/icons/search.svg" alt="검색" width={16} height={16} />}
            className="h-10 p-0"
            borderClassName="border-border"
          />
          <button type="button" className="border-gray100 h-10 rounded-xl border-1">
            <Link href="/addgroup">+ 팀 추가하기</Link>
          </button>
          {filteredGroups.map((group) => (
            <Link
              key={group.id}
              href={`/${group.id}`}
              className={clsx(
                'text-md-md hover:text-primary px-2 py-1',
                String(group.id) === selectedGroupId && 'text-lg-bold text-primary'
              )}
            >
              {group.name}
            </Link>
          ))}
        </div>
        <Link href="/articles" className="hover:text-primary text-md-md cursor-pointer px-2 py-1">
          자유게시판
        </Link>
      </div>
    </>
  );
});

SideMenu.displayName = 'SideMenu';

export default SideMenu;
