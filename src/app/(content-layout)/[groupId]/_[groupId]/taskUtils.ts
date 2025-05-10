import { Tasklist } from '@/types/tasklist';
import { Task } from '@/types/task';

export const countDoneTasks = (tasks: Task[] = []): number => {
  return tasks.filter((task) => Boolean(task.doneAt)).length;
};

export const calculateTaskProgress = (
  tasklists: Tasklist[]
): { totalTaskCount: number; doneTaskCount: number } => {
  return tasklists.reduce(
    (acc, tasklist) => {
      acc.totalTaskCount += tasklist.tasks.length;
      acc.doneTaskCount += countDoneTasks(tasklist.tasks);
      return acc;
    },
    { totalTaskCount: 0, doneTaskCount: 0 }
  );
};
