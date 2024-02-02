import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UsersService } from 'src/users/users.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRoom(@Body() body: CreateRoomDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);

    if (user.role !== "admin") {
      throw new UnauthorizedException('user is not a admin');
    }

    const room = await this.roomsService.createRoom(
      body.name,
      body.capacity,
      body.floor,
    );

    return room;
  }
}
