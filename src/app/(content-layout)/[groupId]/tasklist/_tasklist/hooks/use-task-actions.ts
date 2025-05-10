import axiosClient from '@/lib/axiosClient';
import { Task } from '../types/task-type';

export function useTaskActions(task?: Task) {
  const editTask = () => {
    //수정 리퀘스트
  };

  const deleteTask = async (
    groupId: string,
    taskListId: number,
    taskId: number,
    setIsDelete: () => void
  ) => {
    try {
      await axiosClient.delete(`/groups/${groupId}/task-lists/${taskListId}/tass/${taskId}`);
      setIsDelete();
    } catch {
      //toast 예정-선향
    }
  };

  const toggleTaskDone = async (
    groupId: string,
    taskListId: number,
    doneState: boolean,
    toggleDoneState: () => void
  ) => {
    if (!task) return;
    try {
      await axiosClient.patch(`/groups/${groupId}/task-lists/${taskListId}/tasks/${task.id}`, {
        name: task.name,
        description: task.description,
        done: !doneState,
      });
      toggleDoneState();
    } catch {
      //toast 예정-선향
    }
  };

  return {
    deleteTask,
    editTask,
    toggleTaskDone,
  };
}
