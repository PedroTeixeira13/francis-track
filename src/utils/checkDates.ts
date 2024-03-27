import { BadRequestException } from '@nestjs/common';
import { parseJSON } from 'date-fns';
import { MeetingsExceptionMessage } from 'src/common/enums/errorMessages.enum';

const checkDates = (startTime: string, endTime: string) => {
  const now = new Date();

  if (endTime <= startTime) {
    throw new BadRequestException(MeetingsExceptionMessage.INCOMPATIBLE_TIME);
  }

  const utcStartTime = parseJSON(startTime);
  if (utcStartTime < now) {
    throw new BadRequestException(MeetingsExceptionMessage.INCOMPATIBLE_TIME);
  }

  const utcEndTime = parseJSON(endTime);

  return {
    startTime: utcStartTime,
    endTime: utcEndTime,
  };
};

export default checkDates;
