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
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/findAll')
  async findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:company')
  async findCustomer(@Param('company') company: string) {
    return this.customersService.findCustomer(company);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createCustomer(@Body() body: CreateCustomerDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    const customers = await this.customersService.findCustomer(body.company);
    if (customers) {
      throw new BadRequestException('customer name in use');
    }
    const customer = await this.customersService.createCustomer(body.company);

    return customer;
  }

  @UseGuards(JwtAuthGuard)
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
    return this.customersService.updateCustomer(company, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:company')
  async deleteCustomer(@Param('company') company: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('user is not a admin');
    }
    return this.customersService.deleteRoom(company);
  }
}
