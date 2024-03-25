import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { RoomResponseDto } from './dtos/room-response.dto';
import { RoomsExceptionMessage } from 'src/common/enums/errorMessages.enum';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private repo: Repository<Room>) {}

  async findAll() {
    const rooms = await this.repo.find();
    return rooms.filter((room) => room.active);
  }

  async findRoom(name: string) {
    const room = await this.repo.findOne({ where: { name } });

    if (!room) {
      throw new NotFoundException(RoomsExceptionMessage.NOT_FOUND);
    }
    return room;
  }

  async createRoom(name: string, capacity: number, floor: number) {
    const rooms = await this.repo.findOne({ where: { name } });
    if (rooms) {
      throw new BadRequestException(RoomsExceptionMessage.NAME_IN_USE);
    }
    const room = this.repo.create({ name, capacity, floor });

    return this.repo.save(room);
  }

  async updateRoom(name: string, attrs: Partial<Room>) {
    const room = await this.repo.findOne({ where: { name } });
    if (!room) {
      throw new NotFoundException(RoomsExceptionMessage.NOT_FOUND);
    }
    Object.assign(room, attrs);
    return this.repo.save(room);
  }

  async deleteRoom(name: string) {
    const room = await this.findRoom(name);
    if (!room) {
      throw new NotFoundException(RoomsExceptionMessage.NOT_FOUND);
    }
    room.deletedAt = new Date();
    room.active = false;

    return this.repo.save(room);
  }
}
