import { getTaskLists, getTasks } from '../_tasklist/actions/task-actions';
import ManageTaskItemModal from '../_tasklist/components/manage-task-item-modal/MangeTaskItemModal';
import DateSwitcher from '../_tasklist/components/DateSwitcher';
import TaskLists from '../_tasklist/components/TaskLists';
import Tasks from '../_tasklist/components/Tasks';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';
import { getGroupApiResponse, Group } from '@/types/group';
import axiosServer from '@/lib/axiosServer';

interface Props {
  params: Promise<{ groupId: string }>;

  searchParams: Promise<{ [key: string]: string }>;
}
const getGroup = cache(async (groupId: Group['id']) => {
  'use server';
  const { data } = await axiosServer.get<getGroupApiResponse>(`/groups/${groupId}`, {
    fetchOptions: { cache: 'force-cache' },
  });
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const groupId = Number((await params).groupId);
  const { name, image } = await getGroup(groupId);
  const groupImage = image || '/images/group-thumbnail.png';
  const groupName = name.length < 4 ? name : name.slice(0, 4) + '...';
  const title = `${groupName} 할일 목록 | Coworkers`;
  const description = `${name} 그룹의 할 일 목록과 활동을 확인하세요.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      siteName: 'Coworkers',
      images: [
        {
          url: image,
          width: 400,
          height: 400,
          alt: `${groupImage} 썸네일 이미지`,
        },
      ],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { date: searchParamsDate } = await searchParams;
  const { taskListId: searchParamsTaskListId } = await searchParams;
  const { groupId } = await params;

  const date = searchParamsDate ? new Date(searchParamsDate) : new Date();

  const taskLists = await getTaskLists(groupId);
  if (!taskLists) notFound();
  const taskListId = searchParamsTaskListId ? Number(searchParamsTaskListId) : taskLists[0].id;
  const tasks = await getTasks(groupId, taskListId, date);

  return (
    <div className="flex w-full flex-col gap-6 pb-25">
      <p className="text-lg-bold md:text-xl-bold">할 일</p>
      <DateSwitcher groupId={groupId} date={String(date)} />
      <TaskLists taskLists={taskLists} currentTaskListId={searchParamsTaskListId} />
      <Tasks groupId={groupId} tasks={tasks} taskListId={taskListId} />
      <ManageTaskItemModal groupId={Number(groupId)} taskListId={taskListId} />
    </div>
  );
}
