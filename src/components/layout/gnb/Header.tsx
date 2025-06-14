'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import SideMenu from './SideMenu';
import GroupDropdownSelector from './GroupDropdownSelector';
import { useOutSideClickAutoClose } from '@/utils/use-outside-click-auto-close';
import PATHS from '@/constants/paths';
import ProfileDropdownButton from './ProfileDropdownButton';
import { useUser } from '@/contexts/UserContext';
import { Group } from '@/types/group';

const MINIMAL_HEADER_PATHS = [
  PATHS.HOME,
  PATHS.LOGIN,
  PATHS.SIGNUP,
  PATHS.SIGNUP_KAKAO,
  '/reset-password',
  PATHS.ADDGROUP,
];

export default function Header() {
  const pathname = usePathname();
  const { groupId } = useParams<{ groupId: string }>();
  const { user, memberships, isLoading } = useUser();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const groups: Group[] =
    !isLoading && memberships ? memberships.map((membership) => membership.group) : [];

  useEffect(() => {
    if (!isLoading && memberships) {
      // URL에 groupId가 있는 경우
      if (groupId !== null && groupId !== undefined) {
        const numericId = Number(groupId);
        const isValidGroup = memberships.some((m) => m.group.id === numericId);

        if (isValidGroup) {
          setSelectedGroupId(numericId);
          return;
        }
      }

      // URL에 groupId가 없거나 유효하지 않은 경우, 가장 최근 그룹 선택
      if (memberships.length > 0) {
        const sortedGroups = memberships
          .map((m) => m.group)
          .toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setSelectedGroupId(sortedGroups[0].id);
      } else {
        setSelectedGroupId(null);
      }
    }
  }, [groupId, memberships, isLoading]);

  const {
    ref: sideMenuRef,
    isOpen: isSideMenuOpen,
    setIsOpen: setIsSideMenuOpen,
  } = useOutSideClickAutoClose(false);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);

  const isMinimalHeader = MINIMAL_HEADER_PATHS.includes(pathname);
  const hasGroup = groups.length > 0;

  if (isMinimalHeader) {
    return (
      <header className="bg-bg200 border-border sticky top-0 z-200 flex h-15 w-full justify-center border-b-1">
        <div className="mx-5 flex w-full max-w-300 items-center justify-between">
          <Logo />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-bg200 border-border sticky top-0 z-200 flex h-15 w-full justify-center border-b-1">
      <div className="mx-5 flex w-full max-w-300 items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSideMenuOpen(true)}
              className="block md:hidden"
              title="메뉴 열기"
            >
              <Image src="/icons/gnb-menu.svg" alt="메뉴" width={24} height={24} />
            </button>

            <Logo />
          </div>

          <div className="text-lg-md relative hidden items-center gap-8 md:flex lg:gap-y-10">
            {hasGroup && selectedGroup && (
              <GroupDropdownSelector
                groups={groups}
                selectedGroupName={selectedGroup.name}
                setSelectedGroupId={setSelectedGroupId}
              />
            )}
            <Link href={`/articles`} className="cursor:pointer mt-0">
              자유게시판
            </Link>
          </div>
        </div>

        <div className="ml-auto">
          {!isLoading && user && (
            <ProfileDropdownButton
              userData={{
                ...user,
                email: '',
                memberships: [],
                createdAt: '',
                updatedAt: '',
                teamId: '',
              }}
            />
          )}
        </div>
      </div>

      <SideMenu
        ref={sideMenuRef}
        groups={groups}
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </header>
  );
}
