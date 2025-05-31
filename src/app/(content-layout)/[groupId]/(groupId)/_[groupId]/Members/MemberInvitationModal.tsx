'use client';
import { useState } from 'react';
import clsx from 'clsx';
import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import {
  ModalCloseButton,
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import { Toast } from '@/components/common/Toastify';
import BouncingDots from '@/components/common/loading/BouncingDots';
import { getInvitationToken } from '@/api/group';
import { Group } from '@/types/group';
import { validateEmail, validateEmptyValue } from '@/utils/validators';

interface MemberInvitationModalProps {
  modalId: string;
  groupId: Group['id'];
  isLoading: boolean;
  addMember: (email: string) => Promise<void> | void;
}

export default function MemberInvitationModal({
  modalId,
  groupId,
  isLoading,
  addMember,
}: MemberInvitationModalProps) {
  const { closeModal } = useModal();
  const [isTokenMethod, setIsTokenMethod] = useState(true);
  const [email, setEmail] = useState('');

  const copyInvitationTokenToClipboard = async () => {
    try {
      const res = await getInvitationToken(groupId);
      const token = res.data;
      navigator.clipboard.writeText(token);
      Toast.success('복사 완료');
    } catch {
      Toast.error('멤버 초대 코드 복사 실패');
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <ModalPortal modalId={modalId}>
      <ModalOverlay modalId={modalId} onClick={() => setEmail('')}>
        <ModalContainer className="justify-between px-12 pt-12 pb-8 max-md:h-80 md:h-80 md:px-12">
          <ModalCloseButton modalId={modalId} onClick={() => setEmail('')} />
          <div className="text-md-md text-gray100 flex w-full">
            <button
              className={clsx(
                'border-gray100 flex-1 rounded-l-md border-2 border-r-0 bg-auto px-4 py-1.5',
                isTokenMethod && 'border-primary text-primary border-r-2'
              )}
              onClick={() => setIsTokenMethod(true)}
            >
              코드 복사
            </button>
            <button
              className={clsx(
                'border-gray100 flex-1 rounded-r-md border-2 border-l-0 bg-auto px-4 py-1.5',
                isTokenMethod || 'border-primary text-primary border-l-2'
              )}
              onClick={() => setIsTokenMethod(false)}
            >
              직접 추가
            </button>
          </div>
          {isTokenMethod ? (
            <>
              <div className="flex flex-col gap-2">
                <ModalHeading>참여 코드 복사</ModalHeading>
                <ModalDescription>그룹 참여 코드를 유저에게 전달해주세요.</ModalDescription>
              </div>
              <ModalFooter className="w-full md:w-70">
                <Button variant="solid" size="fullWidth" onClick={copyInvitationTokenToClipboard}>
                  코드 복사하기
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <div className="w-full">
                <ModalHeading className="mb-2">이메일로 멤버 추가</ModalHeading>
                <FormField
                  field="input"
                  placeholder="이메일을 입력해 주세요."
                  isSuccess={!validateEmptyValue(email) && validateEmail(email)}
                  isFailure={validateEmptyValue(email) || !validateEmail(email)}
                  errorMessage="올바른 이메일을 입력해 주세요."
                  value={email}
                  onChange={handleChangeEmail}
                  disabled={isLoading}
                />
              </div>
              <ModalFooter className="w-full md:w-70">
                <Button
                  variant="solid"
                  size="fullWidth"
                  onClick={() => {
                    addMember(email);
                    closeModal(modalId);
                    setEmail('');
                  }}
                  disabled={isLoading || validateEmptyValue(email) || !validateEmail(email)}
                >
                  {isLoading ? <BouncingDots /> : '추가하기'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContainer>
      </ModalOverlay>
    </ModalPortal>
  );
}
