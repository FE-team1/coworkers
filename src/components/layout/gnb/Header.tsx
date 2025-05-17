'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import SideMenu from './SideMenu';
import GroupDropdownSelector from './GroupDropdownSelector';
import { useOutSideClickAutoClose } from '@/utils/use-outside-click-auto-close';
import axiosClient from '@/lib/axiosClient';
import { Group } from '@/types/group';
import { getUserApiResponse } from '@/types/user';
import { getClientCookie, deleteClientCookie } from '@/lib/cookie/client';
import PATHS from '@/constants/paths';
import ProfileDropdownButton from './ProfileDropdownButton';
import { Toast } from '@/components/common/Toastify';

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
  const [userData, setUserData] = useState<getUserApiResponse | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = getClientCookie('accessToken');
        if (!accessToken) {
          deleteClientCookie('accessToken');
          deleteClientCookie('refreshToken');
          console.log('No access token found');
          console.log(document.cookie);
          return;
        }
        const { data } = await axiosClient.get('/user');
        setUserData(data);
        localStorage.setItem('userEmail', data.email);

        const userGroups = Array.isArray(data.memberships)
          ? data.memberships.map((m: { group: Group }) => m.group)
          : [];

        setGroups(userGroups);

        const currentPathId = pathname.split('/')[1];
        const currentGroup = userGroups.find((group: Group) => String(group.id) === currentPathId);
        if (currentGroup?.id != null) {
          setSelectedGroupId(currentGroup.id);
          return;
        }
        if (userGroups[0]?.id != null) {
          setSelectedGroupId(userGroups[0].id);
          return;
        }
        setSelectedGroupId(null);
      } catch (error) {
        Toast.error('사용자 정보를 불러오는 데 실패했습니다.');
        console.error('유저 정보 가져오기 실패', error);
      }
    };

    fetchUserData();
  }, [pathname]);

  const {
    ref: sideMenuRef,
    isOpen: isSideMenuOpen,
    setIsOpen: setIsSideMenuOpen,
  } = useOutSideClickAutoClose(false);

  const isMinimalHeader = MINIMAL_HEADER_PATHS.includes(pathname);
  const hasGroup = groups.length > 0;

  if (isMinimalHeader) {
    return (
      <header className="bg-bg200 border-border sticky top-0 z-200 flex h-15 w-full justify-center border-b-1 py-[14px]">
        <div className="flex w-full max-w-300 items-center justify-between p-4">
          <Logo />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-bg200 border-border sticky top-0 z-200 flex h-15 w-full justify-center border-b-1 py-[14px]">
      <div className="flex w-full max-w-300 items-center justify-between p-4">
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
            {hasGroup && (
              <GroupDropdownSelector
                groups={groups}
                selectedGroupId={selectedGroupId}
                setSelectedGroupId={setSelectedGroupId}
              />
            )}
            <Link href={`/articles`} className="cursor:pointer mt-0">
              자유게시판
            </Link>
          </div>
        </div>

        <div className="ml-auto">{userData && <ProfileDropdownButton userData={userData} />}</div>
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
