import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  AuthExceptionMessage,
  MeetingsExceptionMessage,
  UsersExceptionMessage,
} from 'src/common/enums/errorMessages.enum';
import { MeetingNotFoundError } from 'src/errors/meetingNotFound.error';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from 'src/users/users.service';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingResponseDto } from './dtos/meeting-response.dto';
import { MeetingsService } from './meetings.service';
import { MeetingExceededParticipantsError } from 'src/errors/meetingExceededParticipants.error';
import { MeetingIncompatibleTimeError } from 'src/errors/meetingIncompatibleTime.error';
import { UserNotFoundError } from 'src/errors/userNotFound.error';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
@Serialize(MeetingResponseDto)
export class MeetingsController {
  constructor(
    private meetingsService: MeetingsService,
    private usersService: UsersService,
  ) {}

  @Get('/findAll')
  findAll() {
    return this.meetingsService.findAll();
  }

  @Get('/:id')
  findMeeting(@Param('id') id: string) {
    try {
      return this.meetingsService.findById(id);
    } catch (e: any) {
      if (e instanceof MeetingNotFoundError)
        throw new NotFoundException(MeetingsExceptionMessage.NOT_FOUND);
    }
  }

  @Post('/create')
  async create(@Body() body: CreateMeetingDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'facilities') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    try {
      const meeting = await this.meetingsService.create(body, req.user.id);
      return await this.meetingsService.findById(meeting.id);
    } catch (e: any) {
      if (e instanceof MeetingExceededParticipantsError)
        throw new UnprocessableEntityException(
          MeetingsExceptionMessage.OUT_OF_CAPACITY,
        );
      if (e instanceof MeetingIncompatibleTimeError)
        throw new ConflictException(MeetingsExceptionMessage.INCOMPATIBLE_TIME);
      if (e instanceof UserNotFoundError)
        throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
  }

  @Delete('/delete/:id')
  async deleteMeeting(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'facilities') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    try {
      return await this.meetingsService.delete(id);
    } catch (e: any) {
      if (e instanceof NotFoundException)
        throw new NotFoundException(MeetingsExceptionMessage.NOT_FOUND);
    }
  }
}
