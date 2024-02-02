import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(username: string, password: string, name: string, role: string) {
    const user = this.repo.create({ username, password, name, role });

    return this.repo.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    if (!username) {
      return null;
    }
    return this.repo.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | undefined> {
    if (!id) {
      return null;
    }

    return this.repo.findOne({ where: { id } });
  }

  async update(username: string, attrs: Partial<User>) {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async changeRole(username: string, role: string) {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.role = role;
    return this.repo.save(user);
  }

  async delete(username: string) {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.active = false;
    return this.repo.save(user);
  }
}
