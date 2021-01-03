import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const useTimeDifferenceMessage = (date: number | null): string => {
  const message = useMemo(() => {
    if (!date) {
      return '';
    }

    return dayjs().to(dayjs(date));
  }, [date]);
  return message;
};

export default useTimeDifferenceMessage;
