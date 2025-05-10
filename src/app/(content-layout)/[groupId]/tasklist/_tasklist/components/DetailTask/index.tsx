'use client';
import Image from 'next/image';
import Content from './DetailTaskContentField';
import Button from '@/components/common/Button';
import Check from '@/assets/Check';
import clsx from 'clsx';
import DetailTaskCommentField from './DetailTaskCommentsField';
import axiosClient from '@/lib/axiosClient';
import { useCallback, useEffect, useState } from 'react';
import { useTaskActions } from '../../hooks/use-task-actions';
import { DetailTaskType } from '../../types/task-type';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import TaskListPageFallBack from '../../../error';

interface Props {
  groupId: string;
  taskListId: number;
  isOpen: boolean;
  isDone: boolean;
  setIsDone: () => void;
  taskId: number;
  setIsOpen: () => void;
}

export function DetailTask({
  groupId,
  taskId,
  taskListId,
  isOpen,
  setIsOpen,
  isDone,
  setIsDone,
}: Props) {
  const [currentTask, setCurrentTask] = useState<DetailTaskType>();
  const { toggleTaskDone } = useTaskActions(currentTask);
  const buttonText = isDone ? '완료 취소하기' : '완료 하기';
  // const detailTaskRef = useRef<HTMLDivElement>(null);

  //todo : fetchTask 에러 바운더리 안으로 집어넣기
  //ref 바깥영역 클릭시 닫힘 설정시 모달 팝업후 클릭시, 닫힘 해결하기

  const fetchTask = useCallback(async () => {
    if (!isOpen || !taskId) return;
    try {
      const { data } = await axiosClient(
        `/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`
      );

      setCurrentTask(data);
    } catch {
      throw Error;
    }
  }, [groupId, taskListId, taskId, isOpen]);

  // const closingDetailTaskOutsideClick = (e: MouseEvent) => {
  //   if (detailTaskRef.current && !detailTaskRef.current.contains(e.target as Node)) {
  //     setIsOpen();
  //   }
  // };

  useEffect(() => {
    fetchTask();
    // document.addEventListener('mousedown', closingDetailTaskOutsideClick);
    // return () => {
    //   document.removeEventListener('mousedown', closingDetailTaskOutsideClick);
    // };
  }, [isOpen, fetchTask]);
  if (!currentTask) return;
  return (
    <>
      {isOpen && (
        <div
          // ref={detailTaskRef}
          className="bg-bg200 animate-detail-task fixed top-15 right-0 z-500 flex h-[calc(100%-60px)] w-full flex-col gap-25 px-4 py-4 md:max-w-[700px] md:gap-45.5 md:px-6 md:py-6 lg:max-w-[779px] lg:px-10 lg:py-10"
        >
          <div className="relative flex h-full flex-col gap-4">
            <button onClick={() => setIsOpen()}>
              <Image src="/icons/close.svg" alt="x" width={24} height={24} />
            </button>
            <div className="flex h-full flex-col gap-25 overflow-scroll">
              <ErrorBoundary errorComponent={TaskListPageFallBack}>
                <Content isDone={isDone} task={currentTask} />
                <DetailTaskCommentField taskId={currentTask?.id} />
              </ErrorBoundary>
            </div>
          </div>
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
      )}
    </>
  );
}
