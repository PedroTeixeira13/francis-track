import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersExceptionMessage } from 'src/common/enums/errorMessages.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(username: string, password: string, name: string, role: string) {
    const user = this.repo.create({ username, password, name, role });

    return this.repo.save(user);
  }

  async findAll() {
    const users = await this.repo.find();
    return users.filter((user) => user.active);
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.repo.findOne({ where: { username } });
    if (!user || !user.active) {
      throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
    return user;
  }

  async checkOne(username: string): Promise<User | undefined> {
    return await this.repo.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user || !user.active) {
      throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
    return user;
  }

  async update(username: string, attrs: Partial<User>) {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async changeRole(username: string, role: string) {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
    user.role = role;
    return this.repo.save(user);
  }

  async delete(username: string) {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
    user.active = false;
    user.deletedAt = new Date();
    return this.repo.save(user);
  }
}
