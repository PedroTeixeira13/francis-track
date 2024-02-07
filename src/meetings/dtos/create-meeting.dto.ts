import { IsArray, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  subject: string;

  @IsString()
  roomName: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsArray()
  users: string[];

  @IsArray()
  representatives: string[];
}
