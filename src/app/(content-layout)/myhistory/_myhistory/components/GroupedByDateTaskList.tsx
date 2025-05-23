import { GroupedByDateTask } from '../types/myhistory-page-type';
import GroupedByDateTaskItem from './GroupedByDateTaskItem';

interface Props {
  historyTaskData: GroupedByDateTask[];
}

export default function GroupedByDateTaskList({ historyTaskData }: Props) {
  const groupedByDateArray = Object.entries(
    historyTaskData.reduce(
      (acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      },
      {} as Record<string, GroupedByDateTask[]>
    )
  ).map(([date, tasks]) => ({
    date,
    tasks,
  }));

  return (
    <>
      <div className="flex flex-col gap-10">
        {groupedByDateArray.map((date, idx) => {
          return <GroupedByDateTaskItem key={idx} date={date.date} tasks={date.tasks} />;
        })}
      </div>
    </>
  );
}
