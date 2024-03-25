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
import { AuthExceptionMessage } from 'src/common/enums/errorMessages.enum';
import { UsersService } from 'src/users/users.service';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';
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
    return customers.map((cust) => new CustomerResponseDto(cust));
  }

  @Get('/:company')
  async findCustomer(@Param('company') company: string) {
    const cust = await this.customersService.findCustomer(company);
    return new CustomerResponseDto(cust);
  }

  @Post('/create')
  async createCustomer(@Body() body: CreateCustomerDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    const cust = await this.customersService.createCustomer(body.company);
    return new CustomerResponseDto(cust);
  }

  @Patch('/update/:company')
  async updateCustomer(
    @Param('company') company: string,
    @Body() body: UpdateCustomerDto,
    @Request() req,
  ) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    const cust = await this.customersService.updateCustomer(company, body);
    return new CustomerResponseDto(cust);
  }

  @Delete('/delete/:company')
  async deleteCustomer(@Param('company') company: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }
    const cust = await this.customersService.deleteRoom(company);
    return new CustomerResponseDto(cust);
  }
}
