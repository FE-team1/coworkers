import clsx from 'clsx';
import Image from 'next/image';
import DropDown from '../common/dropdown';
import Repeat from '@/assets/Repeat';

type ScheduleType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONCE';

interface TaskListItemProps {
  type: 'history' | 'taskList';
  onCheckStatusChange?: () => void;
  onClickToggleDailyMode?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  isDone: boolean;
  description: string;
  commentCount: number;
  date: string;
  frequency: ScheduleType;
}

const DROPDOWN_OPTION_LIST = ['수정하기', '삭제하기'];

export default function TaskListItem({
  type = 'taskList',
  onCheckStatusChange,
  onClickToggleDailyMode,
  onEdit,
  onDelete,
  onClick,
  isDone,
  description,
  commentCount,
  date,
  frequency,
}: TaskListItemProps) {
  const checkIcon = isDone ? '/icons/check-box.svg' : '/icons/none-check-box.svg';

  const onDropdownListClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const option = e.currentTarget.textContent;

    if (option === '수정하기') return onEdit?.();
    if (option === '삭제하기') return onDelete?.();
  };

  function taskDescription() {
    return (
      <div className="flex shrink-0 items-center justify-start gap-2">
        <Image
          src={checkIcon}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onCheckStatusChange?.();
          }}
          width={24}
          height={24}
          alt="checked"
          className="cursor-pointer"
        />
        <span className={clsx('text-md-rg text-gray100 pt-0.5', isDone && 'line-through')}>
          {description}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-bg200 flex w-full flex-col gap-2.5 rounded-lg px-[14px] py-3',
        type === 'taskList' && 'cursor-pointer'
      )}
    >
      {type === 'history' ? (
        taskDescription()
      ) : (
        <>
          <div className="flex justify-between sm:gap-3">
            {taskDescription()}
            <div className="flex items-center gap-2 sm:w-full sm:justify-between">
              <div className="flex items-center gap-0.5">
                <Image src="/icons/comment.svg" width={16} height={16} alt="comment" />
                <span className="text-xs-rg text-gray500 pt-0.5">{commentCount}</span>
              </div>

              <DropDown
                onSelect={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  onDropdownListClick(e);
                }}
                options={DROPDOWN_OPTION_LIST}
                size="md"
                dropDownOpenBtn={
                  <Image src="/icons/kebab-icon.svg" width={16} height={16} alt="kebab" />
                }
                placement="top-4 -right-[14px]"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-1.5">
              <Image src="/icons/calendar.svg" width={16} height={16} alt="calendar" />
              <span className="text-xs-rg text-gray500 pt-0.5">{date}</span>
            </div>

            <div className="bg-bg100 mx-2.5 h-2 w-0.25" />

            <div
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onClickToggleDailyMode?.();
              }}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <Repeat
                color={frequency === 'DAILY' ? 'var(--color-primary)' : 'var(--color-gray500)'}
              />
              <span
                className={clsx(
                  'text-xs-rg pt-0.5',
                  frequency === 'DAILY' ? 'text-primary' : 'text-gray500'
                )}
              >
                매일 반복
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
