'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import {
  ModalCloseButton,
  ModalContainer,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import BouncingDots from '@/components/common/loading/BouncingDots';
import { validateEmptyValue } from '@/utils/validators';
import { Tasklist } from '@/types/tasklist';

interface TasklistUpdateModalProps {
  modalId: string;
  tasklist: Tasklist;
  isLoading: boolean;
  updateTasklist: (tasklist: Tasklist, newName: string) => void;
}

export default function TasklistUpdateModal({
  modalId,
  tasklist,
  isLoading,
  updateTasklist,
}: TasklistUpdateModalProps) {
  const [name, setName] = useState(tasklist.name);
  const { closeModal } = useModal();

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const clearName = () => {
    setName('');
  };

  const handleClickAddButton = async () => {
    if (validateEmptyValue(name)) return;
    updateTasklist(tasklist, name);
    clearName();
    closeModal(modalId);
  };

  useEffect(() => {
    setName(tasklist.name);
  }, [tasklist]);

  return (
    <>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId} onClick={clearName}>
          <ModalContainer className="px-12 md:max-w-96 md:px-13">
            <ModalCloseButton modalId={modalId} onClick={clearName} />
            <div className="mb-6 w-full">
              <ModalHeading className="mb-2">할 일 목록 수정</ModalHeading>
              <FormField
                field="input"
                placeholder="목록 이름을 입력해주세요."
                isSuccess={!validateEmptyValue(name) || name.trim() !== tasklist.name}
                isFailure={validateEmptyValue(name) || name.trim() === tasklist.name}
                errorMessage="수정할 이름을 올바르게 입력해 주세요."
                value={name}
                onChange={handleChangeName}
                disabled={isLoading}
              />
            </div>
            <ModalFooter className="w-full">
              <Button
                onClick={handleClickAddButton}
                fontSize="16"
                size="fullWidth"
                disabled={isLoading || validateEmptyValue(name) || name.trim() === tasklist.name}
              >
                {isLoading ? <BouncingDots /> : '수정하기'}
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
