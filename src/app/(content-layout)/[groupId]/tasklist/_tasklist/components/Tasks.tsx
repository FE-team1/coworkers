'use client';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import useDndKit from '../hooks/use-dnd-kit';
import TaskListPageFallBack from '../../error';
import { Task, TaskList } from '../types/task-type';
import TasksWiseTask from './TasksWiseTask';

interface Props {
  groupId: string;
  tasks: Task[];
  taskListId: number;
}
export default function Tasks({ groupId, tasks, taskListId }: Props) {
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);
  const [isClient, setIsClient] = useState(false);

  const orderCurrentTasks = (orderedCurrentTasks: Task[]) => {
    setCurrentTasks(orderedCurrentTasks);
  };

  useEffect(() => {
    setCurrentTasks(tasks);
    setIsClient(true);
  }, [tasks]);

  const { sensors, handleDragEnd } = useDndKit(currentTasks, taskListId!, orderCurrentTasks);

  if (!isClient) return;

  return (
    <ErrorBoundary fallbackRender={({ error }) => <TaskListPageFallBack error={error} />}>
      {currentTasks.length > 0 ? (
        <DndContext
          sensors={sensors}
          onDragEnd={(e: DragEndEvent) => handleDragEnd(e)}
          collisionDetection={closestCenter}
        >
          <SortableContext strategy={verticalListSortingStrategy} items={currentTasks}>
            <div className="flex h-full w-full flex-col gap-4">
              {currentTasks.map((task) => {
                return (
                  <TasksWiseTask
                    taskListId={taskListId}
                    task={task}
                    key={task.id}
                    groupId={groupId}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-md-md text-gray500">
            아직 할 일이 없습니다.
            <br />할 일을 추가 해보세요.
          </p>
        </div>
      )}
    </ErrorBoundary>
  );
}
