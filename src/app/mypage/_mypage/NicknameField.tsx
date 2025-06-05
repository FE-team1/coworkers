'use client';

import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import { validateLengthLimit } from '@/utils/validators';
import { AUTH_ERROR_MESSAGES } from '@/constants/messages/signup';
import BouncingDots from '@/components/common/loading/BouncingDots';

interface NicknameFieldProps {
  nickname: string;
  nicknameError: string;
  setNickname: (value: string) => void;
  setNicknameError: (value: string) => void;
  onClick: () => void;
  isLoading?: boolean;
}

export default function NicknameField({
  nickname,
  nicknameError,
  setNickname,
  setNicknameError,
  onClick,
  isLoading = false,
}: NicknameFieldProps) {
  return (
    <FormField
      field="input"
      label="닉네임"
      placeholder="닉네임을 입력해 주세요"
      value={nickname}
      errorMessage={nicknameError}
      isFailure={!!nicknameError}
      onChange={(e) => {
        const value = e.target.value;
        setNickname(value);

        if (!validateLengthLimit(value)) {
          setNicknameError(AUTH_ERROR_MESSAGES.nickname.tooLong);
          return;
        }

        setNicknameError('');
      }}
      rightSlot={
        <div className="flex items-center">
          <Button
            size="xs"
            fontSize="14"
            className="shrink-0"
            onClick={onClick}
            disabled={isLoading || !!nicknameError || !nickname.trim()}
          >
            {isLoading ? <BouncingDots /> : '변경하기'}
          </Button>
        </div>
      }
    />
  );
}
