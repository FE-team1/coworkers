import Link from 'next/link';
import clsx from 'clsx';
import TasklistProgressBadge from '@/app/(content-layout)/[groupId]/_[groupId]/Tasklists/TasklistProgressBadge';
import TasklistItemDropdown from '@/app/(content-layout)/[groupId]/_[groupId]/Tasklists/TasklistItemDropdown';
import { countDoneTasks } from '@/app/(content-layout)/[groupId]/_[groupId]/taskUtils';
import PATHS from '@/constants/paths';
import { Tasklist } from '@/types/tasklist';

type TasklistItemProps = {
  tasklist: Tasklist;
};

export default function TasklistItem({ tasklist }: TasklistItemProps) {
  const { name, groupId, displayIndex, tasks } = tasklist;
  const totalTaskCount = tasks.length;
  const doneTaskCount = countDoneTasks(tasks);

  return (
    <li className="bg-bg200 flex h-10 items-center justify-between rounded-xl">
      <div className="flex h-full items-center gap-3">
        <div className={clsx('h-full w-3 rounded-l-xl', getTasklistItemColor(displayIndex))}></div>
        <Link href={`${PATHS.getGroupTaskListPath(groupId)}`} className="text-md-md">
          {name}
        </Link>
      </div>
      <div className="mr-2 flex items-center gap-1">
        <TasklistProgressBadge total={totalTaskCount} done={doneTaskCount} />
        <TasklistItemDropdown />
      </div>
    </li>
  );
}

const getTasklistItemColor = (displayIndex: number) => {
  const remain = displayIndex % 4;
  switch (remain) {
    case 0:
      return 'bg-purple';
    case 1:
      return 'bg-blue';
    case 2:
      return 'bg-cyan';
    case 3:
      return 'bg-pink';
  }
};
