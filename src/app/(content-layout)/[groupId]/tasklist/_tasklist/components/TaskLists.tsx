'use client';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { revalidateTasks } from '../actions/task-actions';
import TaskListPageFallBack from '../../error';
import { TaskList } from '../types/task-type';

interface Props {
  taskLists: TaskList[];
  currentTaskListId: string;
}

export default function TaskLists({ taskLists, currentTaskListId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortedTaskLists = taskLists.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleClickChangeCurrentTaskList = async (taskList: TaskList) => {
    const params = new URLSearchParams(searchParams.toString());

    revalidateTasks();

    params.set('taskListId', String(taskList.id));
    router.push(`?${params.toString()}`);
  };

  return (
    <ErrorBoundary fallbackRender={({ error }) => <TaskListPageFallBack error={error} />}>
      <div className="scrollbar-hidden flex h-fit max-w-full gap-3 overflow-x-auto overflow-y-hidden">
        {sortedTaskLists.map((taskList) => {
          return (
            <p
              key={taskList.id}
              onClick={() => handleClickChangeCurrentTaskList(taskList)}
              className={clsx(
                'text-md-md mb-1 w-fit cursor-pointer whitespace-nowrap',
                taskList.id === Number(currentTaskListId)
                  ? 'text-gray200 underline underline-offset-6'
                  : 'text-gray500'
              )}
            >
              {taskList.name}
            </p>
          );
        })}
      </div>
    </ErrorBoundary>
  );
}
