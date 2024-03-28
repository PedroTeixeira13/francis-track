import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { RoomsExceptionMessage } from 'src/common/enums/errorMessages.enum';
import { RoomNotFoundError } from 'src/errors/roomNotFound.error';
import { RoomFoundError } from 'src/errors/roomFound.error';

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
      throw new RoomNotFoundError()
    }
    return room;
  }

  async createRoom(name: string, capacity: number, floor: number) {
    const rooms = await this.repo.findOne({ where: { name } });
    if (rooms) {
      throw new RoomFoundError();
    }
    const room = this.repo.create({ name, capacity, floor });

    return this.repo.save(room);
  }

  async updateRoom(name: string, attrs: Partial<Room>) {
    const room = await this.repo.findOne({ where: { name } });
    if (!room) {
      throw new RoomNotFoundError()
    }
    Object.assign(room, attrs);
    return this.repo.save(room);
  }

  async deleteRoom(name: string) {
    const room = await this.findRoom(name);
    if (!room) {
      throw new RoomNotFoundError()
    }
    room.deletedAt = new Date();
    room.active = false;

    return this.repo.save(room);
  }
}
