import { DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskList, Task } from '../types/task-type';
import { useTaskActions } from './use-task-actions';

export default function useDndKit(
  currentTasks: Task[],
  taskListId: number,
  sortCurrentTasks: (orderedCurrentTasks: Task[]) => void
) {
  const { saveNewTaskOrder } = useTaskActions();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = currentTasks.findIndex((task) => task.id === active.id);
      const newIndex = currentTasks.findIndex((task) => task.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        sortCurrentTasks(arrayMove(currentTasks, oldIndex, newIndex));
        await saveNewTaskOrder(taskListId, Number(active.id), newIndex);
      }
    }
  };
  return {
    sensors,
    handleDragEnd,
  };
}
