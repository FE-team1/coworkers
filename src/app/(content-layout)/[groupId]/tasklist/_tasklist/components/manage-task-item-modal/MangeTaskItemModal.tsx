import { ModalContainer, ModalOverlay, ModalTrigger } from '@/components/common/modal';
import { ModalPortal } from '@/contexts/ModalContext';
import ManageTaskItem from '@/components/manage-task-item/components/ManageTaskItem';
import Plus from '@/assets/Plus';
import { TaskItemProps } from '@/components/manage-task-item/type';

export default function ManageTaskItemModal({
  detailTask,
  groupId,
  taskListId,
  isDone,
  createOrEditModalId,
}: TaskItemProps) {
  const modalId = createOrEditModalId ?? '';

  return (
    <>
      {!detailTask && (
        <ModalTrigger
          modalId={modalId}
          className="text-lg-semi bg-primary fixed right-1/20 bottom-5.5 flex h-12 w-[125px] items-center justify-center rounded-[40px] text-white md:bottom-6 lg:right-1/10 lg:bottom-15"
        >
          <Plus width="16" height="16" /> 할 일 추가
        </ModalTrigger>
      )}
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId}>
          <ModalContainer>
            <ManageTaskItem
              detailTask={detailTask}
              groupId={groupId}
              taskListId={taskListId}
              isDone={isDone}
              createOrEditModalId={createOrEditModalId}
            />
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
