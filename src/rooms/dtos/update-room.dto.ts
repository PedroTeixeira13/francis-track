import { IsNumber, IsString } from "class-validator";

export class UpdateRoomDto {
  @IsString()
  name: string

  @IsNumber()
  capacity: number

  @IsNumber()
  floor: number
}