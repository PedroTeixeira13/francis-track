import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingsService } from './meetings.service';
const { format, differenceInMinutes } = require('date-fns');

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @Get('/findAll')
  async findAll() {
    const meetings = await this.meetingsService.findAll();
    const meetingsReturn = meetings.map((m) => {
      return {
        subject: m.subject,
        room: m.room.name,
        startTime: format(m.startTime, 'EEEE, dd MMMM yyyy'),
        endTime: format(m.endTime, 'EEEE, dd MMMM yyyy'),
        meetingDuration:
          differenceInMinutes(m.endTime, m.startTime) + ' minutes',
        customer: m.customer.company,
        representatives: [m.customer.representatives],
        users: [m.users],
        applicant: m.applicant.username,
      };
    });
    return meetingsReturn;
  }

  @Get('/:subject')
  async findMeeting(@Param('subject') subject: string) {
    const m = await this.meetingsService.findOne(subject);
    const meetingReturn = {
      subject: m.subject,
      room: m.room.name,
      startTime: format(m.startTime, 'EEEE, dd MMMM yyyy'),
      endTime: format(m.endTime, 'EEEE, dd MMMM yyyy'),
      meetingDuration: differenceInMinutes(m.endTime, m.startTime) + ' minutes',
      customer: m.customer.company,
      representatives: [m.customer.representatives],
      users: [m.users],
      applicant: m.applicant.username,
    };
    return meetingReturn;
  }

  @Post('/create')
  async create(@Body() body: CreateMeetingDto, @Request() req) {
    const m = await this.meetingsService.create(body, req.user.id);
    const meetingReturn = {
      subject: m.subject,
      room: m.room.name,
      startTime: format(m.startTime, 'EEEE, dd MMMM yyyy'),
      endTime: format(m.endTime, 'EEEE, dd MMMM yyyy'),
      meetingDuration: differenceInMinutes(m.endTime, m.startTime) + ' minutes',
      customer: m.customer.company,
      representatives: [m.customer.representatives],
      users: [m.users],
      applicant: m.applicant.username,
    };
    return meetingReturn;
  }
}
