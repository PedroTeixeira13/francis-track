import {
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CustomersService } from 'src/customers/customers.service';
import { UsersService } from 'src/users/users.service';
import { CreateRepresentativeDto } from './dtos/create-representative.dto';
import { RepresentativeResponseDto } from './dtos/representative-response.dto';
import { UpdateRepresentativeDto } from './dtos/update-representative.dto';
import { Representative } from './representative.entity';
import { RepresentativesService } from './representatives.service';

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
    const reps = await this.representativesService.findAll();
    return reps.map((rep) => new RepresentativeResponseDto(rep));
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:name')
  async findRepresentative(@Param('name') name: string) {
    const rep = await this.representativesService.findOne(name);
    return new RepresentativeResponseDto(rep);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createRepresentative(
    @Body() body: CreateRepresentativeDto,
    @Request() req,
  ) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }

    const rep = await this.representativesService.create(
      body.name,
      body.company,
    );
    return new RepresentativeResponseDto(rep);
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
      throw new UnauthorizedException('user is not a admin');
    }
    const representative = new Representative();
    const customer = await this.customersService.findCustomer(body.company);

    representative.company = customer;
    representative.name = body.name;
    const rep = await this.representativesService.update(name, representative);
    return new RepresentativeResponseDto(rep);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:name')
  async deleteRepresentative(@Param('name') name: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const rep = await this.representativesService.delete(name);
    return new RepresentativeResponseDto(rep);
  }
}
