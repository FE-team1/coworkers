import CreateTaskListModal from '@/app/(content-layout)/[groupId]/tasklist/_tasklist/components/ModalContents/CreateTaskListModal';
import TasklistItem from '@/app/(content-layout)/[groupId]/_[groupId]/Tasklists/TasklistItem';
import { Group } from '@/types/group';
import { Tasklist } from '@/types/tasklist';

type TasklistsProps = {
  groupId: Group['id'];
  tasklists: Tasklist[];
};

export default function Tasklists({ groupId, tasklists }: TasklistsProps) {
  const totalTasklistCount = tasklists.length;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg-md">
          할 일 목록 <span className="text-lg-rg text-gray500">({totalTasklistCount}개)</span>
        </h2>
        <CreateTaskListModal groupId={`${groupId}`} />
      </div>
      <ol className="flex flex-col gap-4">
        {tasklists.map((tasklist) => (
          <TasklistItem key={tasklist.id} tasklist={tasklist} />
        ))}
      </ol>
    </section>
  );
}
