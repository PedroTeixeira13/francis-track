import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthExceptionMessage } from 'src/common/enums/errorMessages.enum';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokensService: TokensService,
  ) {}

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
  ): Promise<User> {
    const users = await this.usersService.checkOne(username);

    if (users) {
      throw new BadRequestException(AuthExceptionMessage.USERNAME_IN_USE);
    }

    const user = this.usersService.create(username, password, name, role);

    return user;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.tokensService.create(token, payload.sub);

    return {
      access_token: token,
    };
  }
}
