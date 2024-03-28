import { differenceInMinutes } from 'date-fns';
import { Meeting } from '../meeting.entity';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { RoomResponseDto } from 'src/rooms/dtos/room-response.dto';
import { UsersMeetingsDto } from 'src/users-meetings/dto/users-meetings.dto';
import { CustomerResponseDto } from 'src/customers/dtos/customer-response.dto';
import { RepresentativeResponseDto } from 'src/representatives/dtos/representative-response.dto';

export class MeetingResponseDto {
  @Expose()
  subject: string;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  meetingDuration: string;

  @Expose()
  @Type(() => UserResponseDto)
  applicant: UserResponseDto;

  @Expose()
  @Type(() => RoomResponseDto)
  room: RoomResponseDto;

  @Expose()
  @Type(() => UsersMeetingsDto)
  participants: UsersMeetingsDto[];

  @Expose()
  @Type(() => CustomerResponseDto)
  customer: CustomerResponseDto;

  @Expose()
  @Type(() => RepresentativeResponseDto)
  representatives: RepresentativeResponseDto[];
}
