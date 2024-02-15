import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingsService } from './meetings.service';
import { UsersMeetingsService } from 'src/users-meetings/users-meetings.service';
import { UsersService } from 'src/users/users.service';
const { format, differenceInMinutes } = require('date-fns');

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
  ) {}

  @Get('/findAll')
  findAll() {
    return this.meetingsService.findAll();
  }

  @Get('/:subject')
  findMeeting(@Param('subject') subject: string) {
    return this.meetingsService.findOne(subject);
  }

  @Post('/create')
  async create(@Body() body: CreateMeetingDto, @Request() req) {
    //TODO: permitir apenas facilities criar reunioes
    const meeting = await this.meetingsService.create(body, req.user.id);
    return await this.meetingsService.findOne(meeting.subject);
  }

  @Delete('/delete/:id')
  async deleteMeeting(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'facilities') {
      throw new UnauthorizedException(
        'user does not have permission to do this',
      );
    }
    return await this.meetingsService.delete(id);
  }
}
