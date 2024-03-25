import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthExceptionMessage } from 'src/common/enums/errorMessages.enum';
import { UsersService } from 'src/users/users.service';
import { CreateMeetingDto } from './dtos/create-meeting.dto';
import { MeetingsService } from './meetings.service';

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

  @Get('/:id')
  findMeeting(@Param('id') id: string) {
    return this.meetingsService.findById(id);
  }

  @Post('/create')
  async create(@Body() body: CreateMeetingDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'facilities') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    const meeting = await this.meetingsService.create(body, req.user.id);
    return await this.meetingsService.findById(meeting.id);
  }

  @Delete('/delete/:id')
  async deleteMeeting(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'facilities') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    return await this.meetingsService.delete(id);
  }
}
