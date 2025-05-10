import { cache } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Tasklists from '@/app/(content-layout)/[groupId]/_[groupId]/Tasklists';
import Report from '@/app/(content-layout)/[groupId]/_[groupId]/Report';
import Members from '@/app/(content-layout)/[groupId]/_[groupId]/Members';
import axiosServer from '@/lib/axiosServer';
import PATHS from '@/constants/paths';
import { getGroupApiResponse, Group } from '@/types/group';

const getGroup = cache(async (groupId: Group['id']) => {
  'use server';
  const data = await axiosServer
    .get<getGroupApiResponse>(`/groups/${groupId}`, { fetchOptions: { next: { tags: ['group'] } } })
    .then((res) => res.data);
  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ groupId: string }>;
}): Promise<Metadata> {
  const groupId = Number((await params).groupId);
  const data = await getGroup(groupId);
  const image = data.image || '/images/group-thumbnail.png';
  const title = `${data.name} | Coworkers`;
  const description = `${data.name} 그룹의 할 일 목록과 활동을 확인하세요.`;

  return {
    title: title,
    description: description,

    openGraph: {
      title: title,
      description: description,
      // url: '',
      siteName: 'Coworkers',
      images: [
        {
          url: image,
          width: 400,
          height: 400,
          alt: `${data.name} 썸네일 이미지`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: title,
      description: description,
      images: [image],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ groupId: string }> }) {
  const groupId = Number((await params).groupId);
  const data = await getGroup(groupId);

  return (
    <main>
      <div className="border-gray100/10 bg-gray100/10 relative flex h-16 w-full items-center justify-between rounded-xl border-1 px-6 py-5">
        <h1 className="text-xl-bold text-white">{data.name}</h1>
        <Image
          src={'/images/group-thumbnail.png'}
          width={543}
          height={192}
          alt="그룹 기본 이미지"
          className="absolute right-1/4 h-16 w-auto object-contain md:right-20"
        />
        <Link href={PATHS.EDITGROUP}>
          <Image
            src="/icons/gear-icon.svg"
            width={24}
            height={24}
            alt="톱니바퀴 아이콘"
            className="size-6"
          />
        </Link>
      </div>
      <div className="mt-6 mb-50 flex flex-col gap-12 lg:gap-16">
        <Tasklists groupId={groupId} tasklists={data.taskLists} />
        <Report tasklists={data.taskLists} />
        <Members groupId={groupId} members={data.members} />
      </div>
    </main>
  );
}
