import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersService } from './users.service';
import { UserNotFoundError } from 'src/errors/userNotFound.error';
import { UsersExceptionMessage } from 'src/common/enums/errorMessages.enum';

@Controller('users')
@Serialize(UserResponseDto)
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
    return user;
  }

  @Get('/findAll')
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  async findUser(@Param('username') username: string) {
    try {
      return await this.usersService.findOne(username);
    } catch (e: any) {
      if (e instanceof UserNotFoundError)
        throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:username')
  async update(
    @Param('username') username: string,
    @Body() body: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(username, body);
    } catch (e: any) {
      if (e instanceof UserNotFoundError)
        throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changeRole/:username')
  async changeRole(
    @Param('username') username: string,
    @Body() role: ChangeRoleDto,
  ) {
    try {
      return await this.usersService.changeRole(username, role.role);
    } catch (e: any) {
      if (e instanceof UserNotFoundError)
        throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:username')
  async delete(@Param('username') username: string) {
    try {
      return await this.usersService.delete(username);
    } catch (e: any) {
      if (e instanceof UserNotFoundError)
        throw new NotFoundException(UsersExceptionMessage.NOT_FOUND);
    }
  }
}
