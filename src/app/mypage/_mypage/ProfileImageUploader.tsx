'use client';

import FormField from '@/components/common/formField';
import axiosClient from '@/lib/axiosClient';
import postImageUrl from '@/lib/api/image/postImageUrl';
import { Toast } from '@/components/common/Toastify';

interface ProfileImageUploaderProps {
  image: string;
  setImage: (url: string) => void;
}

export default function ProfileImageUploader({ image, setImage }: ProfileImageUploaderProps) {
  return (
    <FormField
      field="file-input"
      label=""
      imageUploaderType="user"
      image={image}
      onImageChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          const uploaded = await postImageUrl(file);
          const uploadedUrl = uploaded.url;

          await axiosClient.patch('/user', {
            image: uploadedUrl,
          });

          setImage(`${uploadedUrl}?t=${Date.now()}`);
          Toast.success('프로필 이미지가 변경 성공');
        } catch {
          Toast.error('프로필 이미지 저장에 실패했습니다. 다시 시도해주세요.');
        }
      }}
    />
  );
}
