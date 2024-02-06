import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting) private repo: Repository<Meeting>,
    private usersService: UsersService,
    private roomsService: RoomsService,
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

  async create(body: CreateMeetingDto) {
    const meeting = new Meeting();
    const applicant = await this.usersService.findOne(body.applicant);
    meeting.applicant = applicant;
    const room = await this.roomsService.findRoom(body.roomName);
    meeting.room = room;
    meeting.startTime = body.startTime;
    meeting.endTime = body.endTime;
    meeting.subject = body.subject;
    for (let i = 0; i < body.users.length; i++) {
      const user = await this.usersService.findOne(body.users[i]);
      meeting.users.users.push(user);
    }
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
