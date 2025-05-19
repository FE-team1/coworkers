import { DateSkeleton, TaskListsSkeleton, TaskSkeleton } from '../_tasklist/components/Skeleton';

export default function TaskListPageLoading() {
  return (
    <main className="flex animate-pulse flex-col gap-6 pb-25">
      <DateSkeleton />
      <div className="flex flex-col gap-4">
        <TaskListsSkeleton />
        <TaskSkeleton />
      </div>
    </main>
  );
}
