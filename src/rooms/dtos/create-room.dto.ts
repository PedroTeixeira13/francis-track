import { IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  
  @IsInt()
  @IsPositive()
  capacity: number;

  @IsInt()
  @IsPositive()
  floor: number;
}
