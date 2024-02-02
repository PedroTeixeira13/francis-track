import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateRoomDto } from './dtos/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/findAll')
  async findAll() {
    return this.roomsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:name')
  async findRoom(@Param('name') name: string) {
    return this.roomsService.findRoom(name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRoom(@Body() body: CreateRoomDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const rooms = await this.roomsService.findRoom(body.name);
    if (rooms) {
      throw new BadRequestException('room name in use');
    }
    const room = await this.roomsService.createRoom(
      body.name,
      body.capacity,
      body.floor,
    );
    return room;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/:name')
  async updateRoom(@Param('name') name: string, @Body() body: UpdateRoomDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    return this.roomsService.updateRoom(name, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:name')
  async deleteRoom(@Param('name') name: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    return this.roomsService.deleteRoom(name);
  }
}
