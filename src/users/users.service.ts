import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOne(username: string): Promise<User | undefined> {
    if (!username) {
      return null;
    }
    return this.repo.findOne({ where: { username } });
  }

  find(username: string) {
    return this.repo.find({ where: { username } });
  }

  create(username: string, password: string, name: string, role: string) {
    const user = this.repo.create({ username, password, name, role });

    return this.repo.save(user);
  }
}
