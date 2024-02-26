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
import { RoomResponseDto } from './dtos/room-response.dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/findAll')
  async findAll() {
    const rooms = await this.roomsService.findAll();
    const roomsReturn = rooms.map((room) => new RoomResponseDto(room));
    return roomsReturn;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:name')
  async findRoom(@Param('name') name: string) {
    const room = await this.roomsService.findRoom(name);
    return new RoomResponseDto(room);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRoom(@Body() body: CreateRoomDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const room = await this.roomsService.createRoom(
      body.name,
      body.capacity,
      body.floor,
    );
    return new RoomResponseDto(room);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/:name')
  async updateRoom(
    @Param('name') name: string,
    @Body() body: UpdateRoomDto,
    @Request() req,
  ) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const room = await this.roomsService.updateRoom(name, body);
    return new RoomResponseDto(room);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:name')
  async deleteRoom(@Param('name') name: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const room = await this.roomsService.deleteRoom(name);
    return new RoomResponseDto(room);
  }
}
