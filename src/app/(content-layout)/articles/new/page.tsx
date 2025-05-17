'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import { Toast } from '@/components/common/Toastify';
import axiosClient from '@/lib/axiosClient';
import postImageUrl from '@/lib/api/image/postImageUrl';
import { validateEmptyValue } from '@/utils/validators';
import PATHS from '@/constants/paths';

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = !validateEmptyValue(title) && !validateEmptyValue(content);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);

      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
    } else {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage('');
      setImage(null);
    }
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageUrl: string | undefined;
      if (image) {
        const imageResponse = await postImageUrl(image);
        uploadedImageUrl = imageResponse.url;
      }

      const articlePayload = {
        title,
        content,
        ...(uploadedImageUrl && { image: uploadedImageUrl }),
      };

      await axiosClient.post('/articles', articlePayload);

      Toast.success('게시글 작성이 완료되었습니다.');
      setTitle('');
      setContent('');
      setImage(null);
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage('');

      router.push(`${PATHS.ARTICLES.BASE}`);
    } catch {
      Toast.error('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <main className="mt-4 mb-8 md:mt-8 md:mb-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg-md md:text-xl-bold">게시글 쓰기</h1>
        <div className="hidden w-46 md:block">
          <Button
            type="submit"
            form="articleForm"
            size="fullWidth"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? '...' : '등록'}
          </Button>
        </div>
      </div>
      <div className="bg-border my-6 h-[1px] w-full"></div>
      <form onSubmit={submitForm} id="articleForm" className="flex flex-col gap-8">
        <FormField
          label="제목"
          name="title"
          field="input"
          placeholder="제목을 입력해주세요."
          required
          errorMessage="제목을 입력해주세요."
          gapSize="16"
          labelSize="16/16"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
        <FormField
          label="내용"
          name="content"
          field="textarea"
          placeholder="내용을 입력해주세요."
          height={240}
          required
          errorMessage="내용을 입력해주세요."
          gapSize="16"
          labelSize="16/16"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
        <FormField
          label="이미지"
          field="file-input"
          name="image"
          imageUploaderType="board"
          image={previewImage}
          onImageChange={handleImageChange}
          disabled={isSubmitting}
        />
      </form>
      <Button
        type="submit"
        form="articleForm"
        className="mt-10 block md:hidden"
        size="fullWidth"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? '...' : '등록'}
      </Button>
    </main>
  );
}
