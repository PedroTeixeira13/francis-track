import { Expose, Type } from 'class-transformer';
import { MeetingResponseDto } from 'src/meetings/dtos/meeting-response.dto';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';

export class UsersMeetingsDto {
  @Expose()
  @Type(() => UserResponseDto)
  users: UserResponseDto[];

  @Expose()
  @Type(() => MeetingResponseDto)
  meetings: MeetingResponseDto[];
}
