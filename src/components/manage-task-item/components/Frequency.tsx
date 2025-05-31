import Button from '@/components/common/Button';
import { OptionSelector } from '@/components/common/dropdown/OptionSelector';
import { useModal } from '@/contexts/ModalContext';
import DangerModal from '@/components/danger-modal';

interface Frequency {
  isEdit: boolean;
  isOnce: boolean;
  handleFrequencyChange: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const DELETE_FREQUENCY_MODAL_ID = 'delete-frequency';

const FREQUENCY_LIST = ['한 번', '매일', '주 반복', '월 반복'];

export default function Frequency({ isEdit, isOnce, handleFrequencyChange }: Frequency) {
  const { openModal } = useModal();

  return isEdit ? (
    <>
      {!isOnce && (
        <Button
          onClick={() => openModal(DELETE_FREQUENCY_MODAL_ID)}
          type="button"
          variant="danger"
          size="custom"
          className="h-10 w-40 rounded-xl"
        >
          반복 설정 삭제하기
        </Button>
      )}
      <DangerModal
        modalId={DELETE_FREQUENCY_MODAL_ID}
        heading="반복 일정을 삭제하시겠어요?"
        description={
          <span>
            삭제된 반복 일정은 복구할 수 없고,
            <br />
            반복 일정은 다시 설정할 수 없습니다.
          </span>
        }
        confirmButton="삭제하기"
        onConfirm={() => {}}
      />
    </>
  ) : (
    <div className="flex items-center gap-4">
      <OptionSelector
        options={FREQUENCY_LIST}
        size="sm"
        placement="top-12"
        onSelect={handleFrequencyChange}
      />
    </div>
  );
}
