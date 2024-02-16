import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersService } from 'src/customers/customers.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersMeetingsService } from 'src/users-meetings/users-meetings.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { Meeting } from './meeting.entity';
import { areIntervalsOverlapping, differenceInMinutes, format } from 'date-fns';
const { parseJSON } = require('date-fns');

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting) private repo: Repository<Meeting>,
    private usersService: UsersService,
    private roomsService: RoomsService,
    private usersMeetingsService: UsersMeetingsService,
    private customersService: CustomersService,
  ) {}

  async findAll() {
    const meetings = await this.repo.find({
      relations: {
        applicant: true,
        customer: { representatives: true },
        room: true,
        participants: { user: true },
      },
    });
    return meetings
      .filter((meeting) => meeting.active)
      .map((m) => {
        return {
          subject: m.subject,
          room: m.room.name,
          startTime: format(m.startTime, 'EEEE, dd MMMM yyyy'),
          endTime: format(m.endTime, 'EEEE, dd MMMM yyyy'),
          meetingDuration:
            differenceInMinutes(m.endTime, m.startTime) + ' minutes',
          customer: m.customer.company,
          representatives: m.customer.representatives.map((rep) => rep.name),
          users: m.participants.map((userMeeting) => userMeeting.user.username),
          applicant: m.applicant.username,
        };
      });
  }

  async findOne(subject: string) {
    const meeting = await this.repo.findOne({
      where: { subject },
      relations: {
        applicant: {
          userMeetings: {
            user: true,
          },
        },
        customer: { representatives: true },
        room: true,
        participants: { user: true },
      },
    });
    if (!meeting) {
      throw new NotFoundException('meeting not found');
    }
    return {
      subject: meeting.subject,
      room: meeting.room.name,
      startTime: format(meeting.startTime, 'EEEE, dd MMMM yyyy'),
      endTime: format(meeting.endTime, 'EEEE, dd MMMM yyyy'),
      meetingDuration:
        differenceInMinutes(meeting.endTime, meeting.startTime) + ' minutes',
      customer: meeting.customer.company,
      representatives: meeting.customer.representatives.map((rep) => rep.name),
      users: meeting.participants.map(
        (userMeeting) => userMeeting.user.username,
      ),
      applicant: meeting.applicant.username,
    };
  }

  async create(body: CreateMeetingDto, applicantId: string) {
    const newMeeting = this.repo.create();

    const { roomName, users, customer, subject, startTime, endTime } = body;

    newMeeting.subject = subject;
    newMeeting.applicant = await this.usersService.findById(applicantId);
    newMeeting.room = await this.roomsService.findRoom(roomName);
    newMeeting.customer = await this.customersService.findCustomer(customer);

    if (endTime <= startTime) {
      throw new BadRequestException('impossible to schedule this meeting time');
    }
    const utcStartTime = parseJSON(startTime);
    newMeeting.startTime = utcStartTime;

    const utcEndTime = parseJSON(endTime);
    newMeeting.endTime = utcEndTime;

    const sameRoomMeetings = await this.repo.find({
      where: { room: { name: roomName } },
    });

    const isOverlapping = sameRoomMeetings.filter((meeting) => {
      return (
        meeting.startTime < newMeeting.endTime &&
        newMeeting.startTime < meeting.endTime
      );
    });

    if (isOverlapping.length > 0) {
      throw new ConflictException('impossible to schedule this meeting time');
    }

    const createdMeeting = await this.repo.save(newMeeting);

    //TODO: lógica para apagar tudo quando nao der certo isso aqui (provavelmente Promise all)
    await this.usersMeetingsService.createMeetingUser(users, createdMeeting);

    return createdMeeting;
  }

  async delete(id: string) {
    const meeting = await this.repo.findOne({ where: { id } });
    if (!meeting) {
      throw new NotFoundException('meeting not found');
    }
    meeting.deletedAt = new Date();
    meeting.active = false;
    return this.repo.save(meeting);
  }
}
