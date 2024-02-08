import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersService } from 'src/customers/customers.service';
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
    private customersService: CustomersService,
  ) {}

  async findAll() {
    const meetings = await this.repo.find({
      relations: { applicant: true, customer: true, room: true },
    });
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
    
    const { roomName, users, customer, subject, startTime, endTime } = body;
    
    newMeeting.subject = subject;
    newMeeting.applicant = await this.usersService.findById(applicantId);
    newMeeting.room = await this.roomsService.findRoom(roomName);
    newMeeting.customer = await this.customersService.findCustomer(customer);
    newMeeting.users = await this.usersMeetingsService.createMeetingUser(
      users,
      newMeeting,
    );
    
    const utcStartTime = parseJSON(startTime);
    newMeeting.startTime = utcStartTime;
    
    const utcEndTime = parseJSON(endTime);
    newMeeting.endTime = utcEndTime;
    
    delete newMeeting.users.meetings;
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
