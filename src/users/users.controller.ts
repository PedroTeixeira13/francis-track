import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
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
  async createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.authService.createUser(
      body.username,
      body.password,
      body.name,
      body.role,
    );
    return new UserResponseDto(user);
  }

  @Get('/findAll')
  async findAll() {
    const users = await this.usersService.findAll();
    const usersReturn = users.map((user) => new UserResponseDto(user));
    return usersReturn;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  async findUser(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:username')
  async update(
    @Param('username') username: string,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.usersService.update(username, body);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changeRole/:username')
  async changeRole(
    @Param('username') username: string,
    @Body() role: ChangeRoleDto,
  ) {
    const user = await this.usersService.changeRole(username, role.role);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:username')
  async delete(@Param('username') username: string) {
    const user = await this.usersService.delete(username);
    return new UserResponseDto(user);
  }
}
