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
    // if (req.user.role !== 'admin' && req.user.role !== 'facilities') {
    //   console.log(req.user.role);
    //   throw new UnauthorizedException(
    //     'user does not have permission to do this',
    //   );
    // }
    const meeting = await this.meetingsService.create(body, req.user.id);
    return await this.meetingsService.findById(meeting.id);
  }

  @Delete('/delete/:id')
  async deleteMeeting(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin' && req.user.role !== 'facilities') {
      throw new UnauthorizedException(
        'user does not have permission to do this',
      );
    }
    return await this.meetingsService.delete(id);
  }
}
