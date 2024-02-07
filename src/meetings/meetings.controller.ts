import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { UsersService } from 'src/users/users.service';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
  ) {}

  @Get('/findAll')
  async findAll() {
    return this.meetingsService.findAll();
  }

  @Get('/:subject')
  async findMeeting(@Param('subject') subject: string) {
    return this.meetingsService.findOne(subject);
  }

  @Post('/create')
  async create(@Body() body: CreateMeetingDto, @Request() req) {
    const rooms = await this.meetingsService.create(body, req.user.id);
    return rooms;
  }
}
