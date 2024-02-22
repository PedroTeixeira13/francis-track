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
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  @Get('/findAll')
  async findAll() {
    const customers = await this.customersService.findAll();
    const customersReturn = customers.map((cust) => {
      return { company: cust.company, representatives: [cust.representatives] };
    });
    return customersReturn;
  }

  @Get('/:company')
  async findCustomer(@Param('company') company: string) {
    const cust = await this.customersService.findCustomer(company);
    const custReturn = {
      company: cust.company,
      representatives: [cust.representatives.map((rep) => rep.name)],
    };
    return custReturn;
  }

  @Post('/create')
  async createCustomer(@Body() body: CreateCustomerDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const cust = await this.customersService.createCustomer(body.company);

    const custReturn = {
      company: cust.company,
      representatives: [cust.representatives],
    };
    return custReturn;
  }

  @Patch('/update/:company')
  async updateCustomer(
    @Param('company') company: string,
    @Body() body: UpdateCustomerDto,
    @Request() req,
  ) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const cust = await this.customersService.updateCustomer(company, body);
    const custReturn = {
      company: cust.company,
      representatives: [cust.representatives],
    };
    return custReturn;
  }

  @Delete('/delete/:company')
  async deleteCustomer(@Param('company') company: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const cust = await this.customersService.deleteRoom(company);
    const custReturn = {
      company: cust.company,
      representatives: [cust.representatives],
    };
    return custReturn;
  }
}
