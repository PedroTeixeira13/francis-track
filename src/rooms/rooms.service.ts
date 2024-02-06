import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

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
      throw new NotFoundException('room not found');
    }
    return room;
  }

  async createRoom(name: string, capacity: number, floor: number) {
    const room = this.repo.create({ name, capacity, floor });

    return this.repo.save(room);
  }

  async updateRoom(name: string, attrs: Partial<Room>) {
    const room = await this.repo.findOne({ where: { name } });
    if (!room) {
      throw new NotFoundException('room not found');
    }
    Object.assign(room, attrs);
    return this.repo.save(room);
  }

  async deleteRoom(name: string) {
    const room = await this.findRoom(name);
    if (!room) {
      throw new NotFoundException('room not found');
    }
    room.deletedAt = new Date();
    room.active = false;

    return this.repo.save(room);
  }
}
