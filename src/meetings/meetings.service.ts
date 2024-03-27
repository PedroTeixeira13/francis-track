import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingsExceptionMessage } from 'src/common/enums/errorMessages.enum';
import { CustomersService } from 'src/customers/customers.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersMeetingsService } from 'src/users-meetings/users-meetings.service';
import { UsersService } from 'src/users/users.service';
import checkDates from 'src/utils/checkDates';
import checkOverlap from 'src/utils/checkOverlap';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingResponseDto } from './dtos/meeting-response.dto';
import { Meeting } from './meeting.entity';

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
      throw new NotFoundException(MeetingsExceptionMessage.NOT_FOUND);
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

    if (repCount.length + users.length > newMeeting.room.capacity) {
      throw new UnprocessableEntityException(
        MeetingsExceptionMessage.OUT_OF_CAPACITY,
      );
    }

    const dates = checkDates(startTime, endTime);
    newMeeting.startTime = dates.startTime;
    newMeeting.endTime = dates.endTime;

    const sameRoomMeetings = await this.repo.find({
      where: { room: { name: roomName } },
    });

    if (!checkOverlap(sameRoomMeetings, newMeeting)) {
      throw new ConflictException(MeetingsExceptionMessage.INCOMPATIBLE_TIME);
    }

    let createdMeeting = new Meeting();
    try {
      createdMeeting = await this.repo.save(newMeeting);
      await this.usersMeetingsService.createMeetingUser(users, createdMeeting);
    } catch (error) {
      await this.repo.delete(createdMeeting.id);
      throw new NotFoundException(MeetingsExceptionMessage.USERS_NOT_FOUND);
    }

    return createdMeeting;
  }

  async delete(id: string) {
    const meeting = await this.repo.findOne({ where: { id } });
    if (!meeting) {
      throw new NotFoundException(MeetingsExceptionMessage.NOT_FOUND);
    }
    meeting.deletedAt = new Date();
    meeting.active = false;
    return this.repo.save(meeting);
  }
}
