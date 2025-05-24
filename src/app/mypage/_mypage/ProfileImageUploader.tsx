'use client';

import { useOptimistic, useTransition } from 'react';
import FormField from '@/components/common/formField';
import postImageUrl from '@/lib/api/image/postImageUrl';
import { Toast } from '@/components/common/Toastify';
import { updateUserImage } from './action';

interface ProfileImageUploaderProps {
  image: string;
  setImage: (url: string) => void;
}

export default function ProfileImageUploader({ image, setImage }: ProfileImageUploaderProps) {
  const [optimisticImage, addOptimisticImage] = useOptimistic(image);
  const [, startTransition] = useTransition();

  return (
    <FormField
      field="file-input"
      label=""
      imageUploaderType="user"
      image={optimisticImage || '/icons/profile-icon.svg'}
      onImageChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        startTransition(() => {
          addOptimisticImage(objectUrl);
        });

        try {
          const uploaded = await postImageUrl(file);
          const uploadedUrl = uploaded.url;

          await updateUserImage(uploadedUrl);

          const finalUrl = `${uploadedUrl}?t=${Date.now()}`;
          setImage(finalUrl);
          startTransition(() => {
            addOptimisticImage(finalUrl);
          });
          Toast.success('프로필 이미지 변경 성공');
        } catch {
          Toast.error('프로필 이미지 변경 실패');
          startTransition(() => {
            addOptimisticImage(image);
          });
        }
      }}
    />
  );
}
