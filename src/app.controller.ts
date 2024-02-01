import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Session,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dtos/create-user.dto';

@Controller()
export class AppController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post('create')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.createUser(
      body.username,
      body.password,
      body.name,
      body.role,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }

  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return this.authService.login(req.user)
  }
}
