import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  AuthExceptionMessage,
  RoomsExceptionMessage,
} from 'src/common/enums/errorMessages.enum';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from 'src/users/users.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomResponseDto } from './dtos/room-response.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { RoomsService } from './rooms.service';
import { RoomNotFoundError } from 'src/errors/roomNotFound.error';
import { RoomFoundError } from 'src/errors/roomFound.error';

@Controller('rooms')
@Serialize(RoomResponseDto)
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/findAll')
  async findAll() {
    return await this.roomsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:name')
  async findRoom(@Param('name') name: string) {
    try {
      return await this.roomsService.findRoom(name);
    } catch (e: any) {
      if (e instanceof RoomNotFoundError)
        throw new NotFoundException(RoomsExceptionMessage.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRoom(@Body() body: CreateRoomDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }

    try {
      const room = await this.roomsService.createRoom(
        body.name,
        body.capacity,
        body.floor,
      );
      return room;
    } catch (e: any) {
      if (e instanceof RoomFoundError)
        throw new BadRequestException(RoomsExceptionMessage.NAME_IN_USE);
    }
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
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    try {
      return await this.roomsService.updateRoom(name, body);
    } catch (e: any) {
      if (e instanceof RoomNotFoundError)
        throw new NotFoundException(RoomsExceptionMessage.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:name')
  async deleteRoom(@Param('name') name: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    try {
      return await this.roomsService.deleteRoom(name);
    } catch (e: any) {
      if (e instanceof RoomNotFoundError)
        throw new NotFoundException(RoomsExceptionMessage.NOT_FOUND);
    }
  }
}
