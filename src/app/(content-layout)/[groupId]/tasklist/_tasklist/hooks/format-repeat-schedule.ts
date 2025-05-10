import { Frequency } from '../types/task-type';

const DAY_MAP = ['일', '월', '화', '수', '목', '금', '토'];

export function getRepeatDescription(frequency: Frequency, schedule?: number[] | number) {
  switch (frequency) {
    case 'ONCE':
      return null;
    case 'DAILY':
      return '매일 반복';
    case 'MONTHLY':
      if (Array.isArray(schedule) || schedule == null) return null;
      return `매 월 ${String(schedule + 1)}일 반복`;
    case 'WEEKLY':
      if (typeof schedule === 'number' || schedule == null) return null;
      const weekDays = schedule.map((day) => DAY_MAP[day]);
      return `매주 ${weekDays.join(', ')}요일 반복`;

    default:
      return null;
  }
}
