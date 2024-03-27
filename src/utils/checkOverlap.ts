import { Meeting } from 'src/meetings/meeting.entity';

const checkOverlap = (
  sameRoomMeetings: Meeting[],
  newMeeting: Meeting,
): boolean => {
  const isOverlapping = sameRoomMeetings.filter((meeting) => {
    return (
      meeting.startTime < newMeeting.endTime &&
      newMeeting.startTime < meeting.endTime
    );
  });

  if (isOverlapping.length > 0) {
    return false;
  }

  return true;
};

export default checkOverlap;
