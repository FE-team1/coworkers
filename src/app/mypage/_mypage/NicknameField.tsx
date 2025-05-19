'use client';

import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';

interface NicknameFieldProps {
  nickname: string;
  nicknameError: string;
  setNickname: (value: string) => void;
  setNicknameError: (value: string) => void;
  onClick: () => void;
}

export default function NicknameField({
  nickname,
  nicknameError,
  setNickname,
  setNicknameError,
  onClick,
}: NicknameFieldProps) {
  return (
    <FormField
      field="input"
      label="이름"
      value={nickname}
      isFailure={!!nicknameError}
      errorMessage={nicknameError}
      onChange={(e) => {
        setNickname(e.target.value);
        setNicknameError('');
      }}
      rightSlot={
        <div className="flex items-center">
          <Button size="xs" fontSize="14" className="shrink-0" onClick={onClick}>
            변경하기
          </Button>
        </div>
      }
    />
  );
}
