import { Expose } from 'class-transformer';

export class RoomResponseDto {
  @Expose()
  name: string;

  @Expose()
  capacity: number;

  @Expose()
  floor: number;
}
