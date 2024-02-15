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
import { RepresentativesService } from './representatives.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRepresentativeDto } from './dtos/create-representative.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateRepresentativeDto } from './dtos/update-representative.dto';
import { Representative } from './representative.entity';
import { CustomersService } from 'src/customers/customers.service';

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
    const repReturn = reps.map((rep) => {
      return { name: rep.name, company: rep.company.company };
    });
    return repReturn;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:name')
  async findRepresentative(@Param('name') name: string) {
    const rep = await this.representativesService.findOne(name);
    const repReturn = {
      name: rep.name,
      company: rep.company.company,
    };
    return repReturn;
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
    const repReturn = {
      name: rep.name,
      company: rep.company.company,
    };
    return repReturn;
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
    const repReturn = {
      name: rep.name,
      company: rep.company.company,
    };
    return repReturn;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:name')
  async deleteRepresentative(@Param('name') name: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const rep = await this.representativesService.delete(name);
    const repReturn = {
      name: rep.name,
      company: rep.company.company,
    };
    return repReturn;
  }
}
