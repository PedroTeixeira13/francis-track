import { IsArray, IsDate, IsString, MinDate } from "class-validator";

export class CreateMeetingDto {

  @IsString()
  subject: string

  @IsString()
  roomName: string

  @IsDate()
  @MinDate(new Date())
  startTime: Date
  
  @IsDate()
  @MinDate(new Date())
  endTime: Date

  @IsString()
  applicant: string

  @IsArray()
  users: string[]

  @IsArray()
  representatives: string[]
}