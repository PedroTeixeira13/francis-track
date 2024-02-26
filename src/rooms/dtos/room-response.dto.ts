import { Room } from '../room.entity';

export class RoomResponseDto {
  name: string;
  capacity: number;
  floor: number;

  constructor(room: Room) {
    this.name = room.name;
    this.floor = room.floor;
    this.capacity = room.capacity;
  }
}
