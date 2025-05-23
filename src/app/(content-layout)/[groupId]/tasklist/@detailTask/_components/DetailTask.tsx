'use client';
import axiosClient from '@/lib/axiosClient';
import { useCallback, useEffect, useState } from 'react';
import { useTaskActions } from '../../_tasklist/hooks/use-task-actions';
import Content from './DetailTaskContentField';
import DetailTaskCommentField from './DetailTaskCommentsField';
import Button from '@/components/common/Button';
import Check from '@/assets/Check';
import clsx from 'clsx';
import { DetailTaskType } from '../../_tasklist/types/task-type';

interface Props {
  groupId: string;
  taskListId: number;
  isDone: boolean;
  setIsDone: () => void;
  taskId: number;
}

export default function DetailTask({ taskId, groupId, taskListId, isDone, setIsDone }: Props) {
  const [currentTask, setCurrentTask] = useState<DetailTaskType>();
  const [error, setError] = useState<Error | null>(null);
  const { toggleTaskDone } = useTaskActions(currentTask);
  const buttonText = isDone ? '완료 취소하기' : '완료 하기';

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    try {
      const { data } = await axiosClient(
        `/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`
      );

      setCurrentTask(data);
    } catch {
      setError(new Error('Task를 불러오는데 오류가 발생했습니다.'));
    }
  }, [groupId, taskListId, taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (error) throw error;
  if (!currentTask) return;

  return (
    <div className="flex h-full flex-col gap-25 overflow-scroll">
      <Content isDone={isDone} task={currentTask} />
      <DetailTaskCommentField taskId={currentTask?.id} />
      <Button
        onClick={() => toggleTaskDone(groupId, taskListId, isDone, setIsDone)}
        className="absolute right-6 bottom-6 lg:right-10 lg:bottom-10"
        variant={isDone ? 'outline-primary' : 'solid'}
        size={isDone ? 'lg' : 'sm'}
      >
        <Check className={clsx(isDone ? 'text-primary' : 'text-gray100')} />
        {buttonText}
      </Button>
    </div>
  );
}
