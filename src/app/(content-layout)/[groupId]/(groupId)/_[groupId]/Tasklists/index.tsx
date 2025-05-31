'use client';
import useTasklists from '@/app/(content-layout)/[groupId]/(groupId)/_[groupId]/Tasklists/useTasklists';
import TasklistItem from '@/app/(content-layout)/[groupId]/(groupId)/_[groupId]/Tasklists/TasklistItem';
import TasklistCreateModal from '@/app/(content-layout)/[groupId]/(groupId)/_[groupId]/Tasklists/TasklistCreateModal';
import TasklistUpdateModal from '@/app/(content-layout)/[groupId]/(groupId)/_[groupId]/Tasklists/TasklistUpdateModal';
import TasklistDeleteModal from '@/app/(content-layout)/[groupId]/(groupId)/_[groupId]/Tasklists/TasklistDeleteModal';
import { ModalTrigger } from '@/components/common/modal';
import { Group } from '@/types/group';
import { Tasklist } from '@/types/tasklist';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TasklistsProps = {
  groupId: Group['id'];
  tasklists: Tasklist[];
};

export default function Tasklists({ groupId, tasklists }: TasklistsProps) {
  const {
    optimisticTasklists,
    selectedTasklist,
    setSelectedTasklist,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    createTasklist,
    updateTasklist,
    deleteTasklist,
  } = useTasklists(groupId, tasklists);

  const tasklistCreateModalId = `tasklistCreate-${groupId}`;
  const tasklistUpdateModalId = selectedTasklist ? `tasklistUpdate-${selectedTasklist.id}` : '';
  const tasklistDeleteModalId = selectedTasklist ? `tasklistDelete-${selectedTasklist.id}` : '';
  const totalTasklistCount = optimisticTasklists.length;
  const pathname = usePathname();

  return (
    <>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg-md">
            할 일 목록 <span className="text-lg-rg text-gray500">({totalTasklistCount}개)</span>
          </h2>
          {/* <ModalTrigger className="text-primary w-fit" modalId={tasklistCreateModalId}>
            + 새로운 목록 추가하기
          </ModalTrigger> */}
          <Link href={`${pathname}/create`} className="text-primary w-fit">
            + 새로운 목록 추가하기
          </Link>
        </div>
        <ol className="flex flex-col gap-4">
          {tasklists.map((tasklist, index) => (
            <TasklistItem
              key={tasklist.id}
              tasklist={tasklist}
              onDropdownTriggerClick={() => setSelectedTasklist(tasklist)}
              index={index}
            />
          ))}
        </ol>
      </section>

      <TasklistCreateModal
        modalId={tasklistCreateModalId}
        createTasklist={createTasklist}
        isLoading={isCreateLoading}
      />

      {selectedTasklist && (
        <TasklistUpdateModal
          tasklist={selectedTasklist}
          modalId={tasklistUpdateModalId}
          updateTasklist={updateTasklist}
          isLoading={isUpdateLoading}
        />
      )}

      {selectedTasklist && (
        <TasklistDeleteModal
          tasklist={selectedTasklist}
          modalId={tasklistDeleteModalId}
          deleteTasklist={deleteTasklist}
          isLoading={isDeleteLoading}
        />
      )}
    </>
  );
}
