import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Post('/create')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.createUser(
      body.username,
      body.password,
      body.name,
      body.role,
    );
    return user;
  }

  @Get('/findAll')
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:username')
  async update(
    @Param('username') username: string,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.usersService.update(username, body);
    return `${user.id}, \n${user.name}, \n${user.username}`;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changeRole/:username')
  async changeRole(
    @Param('username') username: string,
    @Body() role: ChangeRoleDto,
  ) {
    return this.usersService.changeRole(username, role.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:username')
  async delete(@Param('username') username: string) {
    return this.usersService.delete(username);
  }
}
