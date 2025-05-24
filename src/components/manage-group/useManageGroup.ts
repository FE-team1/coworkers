import { useState } from 'react';
import { useRouter } from 'next/navigation';
import postImageUrl from '@/lib/api/image/postImageUrl';
import axiosClient from '@/lib/axiosClient';
import { validateEmptyValue } from '@/utils/validators';
import { Toast } from '../common/Toastify';
import { ManageGroup } from './ManageGroup';
import { useUser } from '@/contexts/UserContext';

const GROUP_MESSAGE = {
  EMPTY_GROUP_IMAGE: '프로필 이미지를 넣어주세요.',
  EMPTY_GROUP_NAME: '팀 이름을 작성해 주세요.',
  DUPLICATED_GROUP_NAME: '이미 존재하는 팀 이름입니다.',
  OVER_LENGTH_GROUP_NAME: '팀 이름은 10글자까지 가능합니다.',
};

const INITIAL_GROUP_VALUE: ManageGroup = {
  image: '',
  name: '',
};

export default function useManageGroup({
  isEdit,
  groupData,
  groupNames,
}: {
  isEdit: boolean;
  groupData?: ManageGroup;
  groupNames: string[];
}) {
  const [group, setGroup] = useState<ManageGroup>(groupData ?? INITIAL_GROUP_VALUE);
  const [isSubmit, setIsSubmit] = useState(false);
  const { fetchUser } = useUser();

  const router = useRouter();

  const isImageEmpty = group.image === '';
  const isNameEmpty = validateEmptyValue(group.name);
  const isNameOverLimit = group.name.length > 10;
  const isNameDuplicate = isEdit
    ? groupNames.filter((name) => name !== groupData?.name).includes(group.name)
    : groupNames.includes(group.name);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroup((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    postImageUrl(file)
      .then((result) => {
        setGroup((prev) => ({
          ...prev,
          image: result.url,
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const imageErrorMessage = () => {
    if (isImageEmpty) return GROUP_MESSAGE.EMPTY_GROUP_IMAGE;
  };

  const nameErrorMessage = () => {
    if (isNameEmpty) return GROUP_MESSAGE.EMPTY_GROUP_NAME;

    if (isNameDuplicate) return GROUP_MESSAGE.DUPLICATED_GROUP_NAME;

    if (isNameOverLimit) return GROUP_MESSAGE.OVER_LENGTH_GROUP_NAME;
  };

  const isNameFailure = isNameEmpty || isNameDuplicate || isNameOverLimit;

  const isManageTeamFormValid =
    !isImageEmpty && !isNameEmpty && !isNameDuplicate && !isNameOverLimit;

  const isGroupDataUnchanged = group.image === groupData?.image && group.name === groupData.name;

  const handleManageGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isManageTeamFormValid) return;

    if (isGroupDataUnchanged) {
      Toast.info('변경 사항이 없습니다.');
      return;
    }

    setIsSubmit(true);

    axiosClient
      .request({
        url: isEdit ? `/groups/${groupData?.id}` : '/groups',
        method: isEdit ? 'patch' : 'post',
        data: {
          name: group.name,
          image: group.image,
        },
      })
      .then((result) => {
        router.push(`/${result.data.id}`);
        fetchUser();
      })
      .catch(() => {
        const action = isEdit ? '수정' : '생성';
        Toast.error(`팀 ${action} 실패`);
      })
      .finally(() => setIsSubmit(false));
  };

  return {
    group,
    isNameFailure,
    isImageEmpty,
    isSubmit,
    imageErrorMessage,
    nameErrorMessage,
    handleNameChange,
    handleImageChange,
    handleManageGroupSubmit,
  };
}
