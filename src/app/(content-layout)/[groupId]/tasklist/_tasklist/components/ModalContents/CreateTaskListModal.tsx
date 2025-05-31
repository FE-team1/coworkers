'use client';
import { useState } from 'react';
import Button from '@/components/common/Button';
import FormField from '@/components/common/formField';
import {
  ModalCloseButton,
  ModalContainer,
  ModalDescription,
  ModalFooter,
  ModalHeading,
  ModalOverlay,
  ModalTrigger,
} from '@/components/common/modal';
import { useModal, ModalPortal } from '@/contexts/ModalContext';
import axiosClient from '@/lib/axiosClient';
import { revalidateTaskLists } from '../../actions/task-actions';
import { Toast } from '@/components/common/Toastify';
import { AxiosError } from 'axios';
import BouncingDots from '@/components/common/loading/BouncingDots';

interface Props {
  groupId: string;
}
export default function CreateTaskListModal({ groupId }: Props) {
  const [currentValue, setCurrentValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForceShowError, setIsForceShowError] = useState(false);

  const { closeModal } = useModal();

  const clearState = () => {
    setCurrentValue('');
    setErrorMessage('');
    setIsForceShowError(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setCurrentValue(value);
    if (value !== '') return setErrorMessage('');
  };

  const handleSubmitCreateTaskList = async () => {
    setIsLoading(true);

    try {
      await axiosClient.post(`/groups/${groupId}/task-lists`, { name: currentValue });
      Toast.success('새로운 목록 생성 성공');
      closeModal('createTaskList');

      revalidateTaskLists();
      clearState();
    } catch (error) {
      setIsForceShowError(true);
      Toast.error('새로운 목록 생성 실패');
      if (error instanceof AxiosError) {
        const status = error.response?.status;

        if (status === 409) return setErrorMessage('이미 존재하는 목록 이름 입니다.');
      }
      setErrorMessage('예기치 못한 이유로 목록 생성에 실패 했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalTrigger className="text-primary w-fit" modalId="createTaskList">
        + 새로운 목록 추가하기
      </ModalTrigger>
      <ModalPortal modalId="createTaskList">
        <ModalOverlay modalId="createTaskList" onClick={() => clearState()}>
          <ModalContainer className="md:w-full md:max-w-96">
            <ModalCloseButton modalId="createTaskList" onClick={() => clearState()} />
            <div className="mb-6 w-full px-6">
              <ModalHeading className="mb-2">새로운 목록 추가</ModalHeading>
              <ModalDescription className="text-md-md text-gray500 mb-6 w-full">
                할 일에 대한 목록을 추가하고
                <br />
                목록별 할 일을 만들 수 있습니다.
              </ModalDescription>
              <FormField
                label="목록 이름"
                field="input"
                placeholder="목록 이름을 입력해주세요."
                required
                isSuccess={currentValue !== '' && !Boolean(errorMessage)}
                isFailure={currentValue === '' || !!errorMessage || isForceShowError}
                errorMessage={currentValue === '' ? '이름을 입력해주세요' : errorMessage}
                gapSize="32"
                labelSize="16/20"
                value={currentValue}
                onChange={handleChange}
              />
              <ModalFooter className="mt-6 w-full">
                <Button
                  onClick={handleSubmitCreateTaskList}
                  fontSize="16"
                  size="fullWidth"
                  disabled={currentValue === '' || isLoading}
                >
                  {isLoading ? <BouncingDots /> : '만들기'}
                </Button>
              </ModalFooter>
            </div>
          </ModalContainer>
        </ModalOverlay>
      </ModalPortal>
    </>
  );
}
