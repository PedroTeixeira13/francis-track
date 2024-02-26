import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInMinutes, format } from 'date-fns';
import { CustomersService } from 'src/customers/customers.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersMeetingsService } from 'src/users-meetings/users-meetings.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { Meeting } from './meeting.entity';
import { MeetingResponseDto } from './dtos/meeting-response.dto';
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
    return meetings;
  }

  async findById(id: string) {
    const meeting = await this.repo.findOne({
      where: { id },
      relations: {
        applicant: true,
        customer: { representatives: true },
        room: true,
        participants: { user: true },
      },
    });
    if (!meeting) {
      throw new NotFoundException('meeting not found');
    }
    return new MeetingResponseDto(meeting);
  }

  async create(body: CreateMeetingDto, applicantId: string) {
    const newMeeting = this.repo.create();

    const { roomName, users, customer, subject, startTime, endTime } = body;

    newMeeting.subject = subject;
    newMeeting.applicant = await this.usersService.findById(applicantId);
    newMeeting.room = await this.roomsService.findRoom(roomName);
    newMeeting.customer = await this.customersService.findCustomer(customer);

    const repCount = newMeeting.customer.representatives;

    const now = new Date();

    if (repCount.length + users.length > newMeeting.room.capacity) {
      throw new UnprocessableEntityException(
        'number of participants greater than the room capacity',
      );
    }

    if (endTime <= startTime) {
      throw new BadRequestException('impossible to schedule this meeting time');
    }

    const utcStartTime = parseJSON(startTime);
    if (utcStartTime < now) {
      throw new BadRequestException("you can't create a meeting in the past");
    }
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

    var createdMeeting = new Meeting();
    try {
      createdMeeting = await this.repo.save(newMeeting);
      await this.usersMeetingsService.createMeetingUser(users, createdMeeting);
    } catch (error) {
      await this.repo.delete(createdMeeting.id);
      throw new NotFoundException('one or more users not found');
    }

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
