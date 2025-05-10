'use server';
import { revalidateTag } from 'next/cache';
import axiosServer from '@/lib/axiosServer';
import { Group } from '@/types/group';
import { User } from '@/types/user';

export async function removeMemberAction(groupId: Group['id'], userId: User['id']) {
  try {
    await axiosServer.delete(`/groups/${groupId}/member/${userId}`);
    revalidateTag('group');
    return { success: true, message: '멤버가 성공적으로 삭제되었습니다.' };
  } catch {
    return { success: false, message: '멤버 삭제에 실패했습니다.' };
  }
}
