import { User } from '@/types/user';
import { Member } from './member-type';

export type Frequency = 'DAILY' | 'WEEKLY' | 'ONCE' | 'MONTHLY';

interface Recurring {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  frequencyType: Frequency;
  weekDays?: number[];
  monthDay?: number;
  taskListId: number;
  groupId: number;
  writerId: number;
}
// taskLists[] -> taskList{}-> tasks[]-> task(기준){} -> detailTask

//teamId/groups/[groupId]:get
export interface TaskListsApiResponse {
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string;
  name: string;
  id: number;
  members: Member[];
  taskLists: TaskList[];
}

export interface TaskList {
  displayIndex: number;
  groupId: number;
  updatedAt: string;
  createdAt: string;
  name: string;
  id: number;
  tasks: string[];
}

//teamId/groups/[groupId]/task-lists/{taskListId}/tasks

export type TasksApiResponse = Task[];

//기준이 되는 인터페이스
export interface Task {
  displayIndex: number;
  commentCount: number;
  frequency: Frequency;
  monthDay?: 0;
  weekDays?: number[];
  doneAt: string;
  date: string;
  description: string;
  doneBy: {
    user: User;
  };
  writer: User;
  deletedAt: string;
  recurringId: number;
  updatedAt: string;
  name: string;
  id: number;
}

//teamId/groups/[groupId]/task-lists/{taskListId}/tasks/{taskId}

export interface DetailTaskType extends Task {
  recurring: Recurring;
}
