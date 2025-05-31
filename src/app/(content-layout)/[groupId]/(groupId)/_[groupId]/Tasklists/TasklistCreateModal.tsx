'use client';
import { useState } from 'react';
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

interface TasklistCreateModalProps {
  modalId: string;
  isLoading: boolean;
  createTasklist: (name: string) => void;
}

export default function TasklistCreateModal({
  modalId,
  isLoading,
  createTasklist,
}: TasklistCreateModalProps) {
  const [name, setName] = useState('');
  const { closeModal } = useModal();

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const clearName = () => {
    setName('');
  };

  const handleClickAddButton = async () => {
    if (validateEmptyValue(name)) return;
    createTasklist(name);
    clearName();
    closeModal(modalId);
  };

  return (
    <>
      <ModalPortal modalId={modalId}>
        <ModalOverlay modalId={modalId} onClick={clearName}>
          <ModalContainer className="px-13 pt-12 pb-8 md:px-13 md:pt-12 md:pb-8">
            <ModalCloseButton modalId={modalId} onClick={clearName} />
            <div className="mb-6 w-70">
              <ModalHeading className="mb-2">할 일 목록 추가</ModalHeading>
              <FormField
                field="input"
                placeholder="목록 이름을 입력해주세요."
                isSuccess={!validateEmptyValue(name)}
                isFailure={validateEmptyValue(name)}
                errorMessage="이름을 입력해 주세요."
                value={name}
                onChange={handleChangeName}
                disabled={isLoading}
              />
            </div>
            <ModalFooter className="w-70">
              <Button onClick={handleClickAddButton} fontSize="16" size="fullWidth">
                {isLoading ? <BouncingDots /> : '만들기'}
              </Button>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
