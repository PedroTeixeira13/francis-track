import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      const { password, username, ...rest } = user;
      return rest;
    }

    return null;
  }

  async createUser(
    username: string,
    password: string,
    name: string,
    role: string,
  ) {
    const users = await this.usersService.find(username);

    if (users.length) {
      throw new BadRequestException('username in use');
    }

    const user = this.usersService.create(username, password, name, role);

    return user;
  }

  async signin(username: string, password: string) {
    const user = await this.usersService.find(username);

    if (!user) {
      throw new NotFoundException('user not found');
    }
  }
}
