'use client';

import Link from 'next/link';
import DropDownGroupsItem from '@/components/common/dropdown/GroupsItem';
import Button from '@/components/common/Button';
import { OptionSelector } from '@/components/common/dropdown/OptionSelector';
import { Group } from '@/types/group';

interface GroupDropdownSelectorProps {
  groups: Group[];
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number) => void;
}

export default function GroupDropdownSelector({
  groups,
  selectedGroupId,
  setSelectedGroupId,
}: GroupDropdownSelectorProps) {
  const sortedGroups = [...groups].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const selectedGroup = sortedGroups.find((group) => group.id === selectedGroupId);

  return (
    <OptionSelector
      placement="mt-6 right-0"
      size="xl"
      defaultValue={selectedGroup?.name}
      options={sortedGroups.map((group) => (
        <DropDownGroupsItem key={group.id} group={group} />
      ))}
      onSelect={(e) => {
        const clickedGroupId = (e.currentTarget as HTMLElement).dataset.groupId;
        if (clickedGroupId) {
          setSelectedGroupId(Number(clickedGroupId));
        }
      }}
      footerBtn={
        <Button variant="ghost-white" size="fullWidth" fontSize="16">
          <Link href="/addgroup">+ 팀 추가하기</Link>
        </Button>
      }
    />
  );
}
