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
import { CustomersService } from 'src/customers/customers.service';
import { UsersService } from 'src/users/users.service';
import { CreateRepresentativeDto } from './dtos/create-representative.dto';
import { RepresentativeResponseDto } from './dtos/representative-response.dto';
import { UpdateRepresentativeDto } from './dtos/update-representative.dto';
import { Representative } from './representative.entity';
import { RepresentativesService } from './representatives.service';
import {
  AuthExceptionMessage,
  RepresentativesExceptionMessage,
} from 'src/common/enums/errorMessages.enum';
import { RepresentativeNotFoundError } from 'src/errors/representativeNotFound.error';
import { RepresentativeFoundError } from 'src/errors/representativeFound.error';

@Controller('representatives')
export class RepresentativesController {
  constructor(
    private representativesService: RepresentativesService,
    private usersService: UsersService,
    private customersService: CustomersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/findAll')
  async findAll() {
    return await this.representativesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:name')
  async findRepresentative(@Param('name') name: string) {
    try {
      return await this.representativesService.findOne(name);
    } catch (e: any) {
      if (e instanceof RepresentativeNotFoundError)
        throw new NotFoundException(RepresentativesExceptionMessage.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRepresentative(
    @Body() body: CreateRepresentativeDto,
    @Request() req,
  ) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }

    try {
      const rep = await this.representativesService.create(
        body.name,
        body.company,
      );
      return rep;
    } catch (e: any) {
      if (e instanceof RepresentativeFoundError)
        throw new BadRequestException(
          RepresentativesExceptionMessage.USERNAME_IN_USE,
        );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update/:name')
  async update(
    @Param('name') name: string,
    @Body() body: UpdateRepresentativeDto,
    @Request() req,
  ) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    const representative = new Representative();
    const customer = await this.customersService.findCustomer(body.company);

    representative.company = customer;
    representative.name = body.name;
    try {
      return await this.representativesService.update(name, representative);
    } catch (e: any) {
      if (e instanceof RepresentativeNotFoundError)
        throw new NotFoundException(RepresentativesExceptionMessage.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:name')
  async deleteRepresentative(@Param('name') name: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    try {
      return await this.representativesService.delete(name);
    } catch (e: any) {
      if (e instanceof RepresentativeNotFoundError)
        throw new NotFoundException(RepresentativesExceptionMessage.NOT_FOUND);
    }
  }
}
