import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/create')
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
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('update/:username')
  async update(
    @Param('username') username: string,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.usersService.update(username, body);
    return `${user.id}, \n${user.name}, \n${user.username}`
  }

  @Delete('delete/:username')
  async delete (@Param('username') username: string) {
    return this.usersService.delete(username)
  }
}
