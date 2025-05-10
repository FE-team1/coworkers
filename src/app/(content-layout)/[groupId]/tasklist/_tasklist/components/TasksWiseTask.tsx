'use client';
import TaskListItem from '@/components/task-list-item/TaskListItem';
import { format, isValid } from 'date-fns';
import { useState } from 'react';
import { Task } from '../types/task-type';
import { DetailTask } from './DetailTask';
import RemoveTaskModal from './ModalContents/RemoveTaskModal';
import { useTaskActions } from '../hooks/use-task-actions';
import { useTaskModals } from '../hooks/use-task-modals';
import ManageTaskItemModal from './manage-task-item-modal/MangeTaskItemModal';

interface Props {
  task: Task;
  groupId: string;
  taskListId: number;
}

export default function TasksWiseTask({ task, groupId, taskListId }: Props) {
  const [isDone, setIsDone] = useState(!!task.doneAt);
  const [isDelete, setIsDelete] = useState(false);
  const [isDetailTaskOpen, setIsDetailTaskOpen] = useState(false);

  const taskDeleteModalId = `${task.id}-delete`;
  const createOrEditModalId = task ? `${task.id}-edit` : `${taskListId}-create`;

  const { popUpDeleteTaskModal, popUpEditTaskModal, popUpDetailTask } = useTaskModals();
  const { deleteTask } = useTaskActions();
  const { toggleTaskDone } = useTaskActions(task);

  const safeFormatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (!isValid(date)) return '';

    return format(date, 'yyyy년 MM월 dd일');
  };

  const toggleTaskStatus = () => {
    setIsDone((prev) => !prev);
  };

  const detailTaskOpen = () => {
    setIsDetailTaskOpen((prev) => !prev);
  };

  const change = () => {
    setIsDelete(true);
  };
  return (
    <>
      {!isDelete && (
        <>
          <TaskListItem
            key={task.id}
            type="taskList"
            onCheckStatusChange={() =>
              toggleTaskDone(groupId, taskListId, isDone, toggleTaskStatus)
            }
            onEdit={() => popUpEditTaskModal(createOrEditModalId)}
            onDelete={() => popUpDeleteTaskModal(taskDeleteModalId)}
            onClick={() => popUpDetailTask(detailTaskOpen)}
            isDone={isDone}
            name={task.name}
            commentCount={task.commentCount}
            date={safeFormatDate(task.date)}
            frequency={task.frequency}
          />
          <DetailTask
            isDone={isDone}
            setIsDone={toggleTaskStatus}
            taskId={task.id}
            groupId={groupId}
            taskListId={taskListId}
            setIsOpen={detailTaskOpen}
            isOpen={isDetailTaskOpen}
          />
          <RemoveTaskModal
            taskName={task.name}
            modalId={taskDeleteModalId}
            deleteTask={() => deleteTask(groupId, taskListId, task.id, change)}
          />
          <ManageTaskItemModal
            task={task}
            groupId={Number(groupId)}
            taskListId={taskListId}
            isDone={isDone}
            createOrEditModalId={createOrEditModalId}
          />
        </>
      )}
    </>
  );
}
