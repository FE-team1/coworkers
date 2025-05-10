import ReportProgress from '@/app/(content-layout)/[groupId]/_[groupId]/Report/GroupProgress';
import TaskCount from '@/app/(content-layout)/[groupId]/_[groupId]/Report/TaskCount';
import { calculateTaskProgress } from '@/app/(content-layout)/[groupId]/_[groupId]/taskUtils';
import { Tasklist } from '@/types/tasklist';

interface Props {
  tasklists: Tasklist[];
}

export default function Report({ tasklists }: Props) {
  const { totalTaskCount, doneTaskCount } = calculateTaskProgress(tasklists);
  const percent = totalTaskCount === 0 ? 0 : Math.ceil((doneTaskCount / totalTaskCount) * 100);

  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="text-lg-md">리포트</h2>
      <div className="bg-bg200 h-56 rounded-xl px-6 py-6 lg:h-[217px]">
        <div className="flex justify-between">
          <ReportProgress percent={percent} />
          <div className="flex h-full w-full max-w-100 flex-col gap-4">
            <TaskCount variant="total" count={totalTaskCount} />
            <TaskCount variant="done" count={doneTaskCount} />
          </div>
        </div>
      </div>
    </section>
  );
}
