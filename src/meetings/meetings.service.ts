import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingsRepresentativesService } from 'src/meetings-representatives/meetings-representatives.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersMeetingsService } from 'src/users-meetings/users-meetings.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { Meeting } from './meeting.entity';
const { parseJSON } = require('date-fns');

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting) private repo: Repository<Meeting>,

    private usersService: UsersService,
    private roomsService: RoomsService,
    private usersMeetingsService: UsersMeetingsService,
    private meetingsRepresentativesService: MeetingsRepresentativesService,
  ) {}

  async findAll() {
    const meetings = await this.repo.find();
    return meetings.filter((meeting) => meeting.active);
  }

  async findOne(subject: string) {
    const meeting = this.repo.findOne({ where: { subject } });
    if (!meeting) {
      throw new NotFoundException('meeting not found');
    }
    return meeting;
  }

  async create(body: CreateMeetingDto, applicantId: string) {
    const newMeeting = await this.repo.create();

    const { roomName, users, representatives, subject, startTime, endTime } = body;

    const applicant = await this.usersService.findById(applicantId);
    newMeeting.applicant = applicant;

    const room = await this.roomsService.findRoom(roomName);
    newMeeting.room = room;
    newMeeting.subject = subject;

    const utcStartTime = parseJSON(startTime);
    newMeeting.startTime = utcStartTime;

    const utcEndTime = parseJSON(endTime);
    newMeeting.endTime = utcEndTime;

    newMeeting.users = await this.usersMeetingsService.createMeetingUser(
      users,
      newMeeting,
    );
    newMeeting.meetingsRepresentatives =
      await this.meetingsRepresentativesService.createMeetingRepresentative(
        representatives,
        newMeeting,
      );
    return this.repo.save(newMeeting);
  }

  async update(subject: string, attrs: Partial<Meeting>) {
    const meeting = await this.findOne(subject);
    if (!meeting) {
      throw new NotFoundException('meeting not found');
    }
    Object.assign(meeting, attrs);
    return this.repo.save(meeting);
  }

  async delete(subject: string) {
    const meeting = await this.findOne(subject);
    if (!meeting) {
      throw new NotFoundException('meeting not found');
    }
    meeting.deletedAt = new Date();
    meeting.active = false;
    return this.repo.save(meeting);
  }
}
