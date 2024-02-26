import { differenceInMinutes } from 'date-fns';
import { Meeting } from '../meeting.entity';

export class MeetingResponseDto {
  subject: string;
  startTime: Date;
  endTime: Date;
  meetingDuration: string;
  applicant: string;
  room: string;
  participants: string[];
  customer: string;
  representatives: string[];

  constructor(meeting: Meeting) {
    this.subject = meeting.subject;
    this.startTime = meeting.startTime;
    this.endTime = meeting.endTime;
    this.meetingDuration =
      differenceInMinutes(meeting.endTime, meeting.startTime) + ' minutes';
    this.applicant = meeting.applicant.username;
    this.room = meeting.room.name;
    this.participants = meeting.participants.map(
      (userMeeting) => userMeeting.user.username,
    );
    this.customer = meeting.customer.company;
    this.representatives = meeting.customer.representatives.map(
      (rep) => rep.name,
    );
  }
}
