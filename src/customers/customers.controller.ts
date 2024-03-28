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
  CustomerExceptionMessage,
} from 'src/common/enums/errorMessages.enum';
import { CustomerFoundError } from 'src/errors/customerFound.error';
import { CustomerNotFoundError } from 'src/errors/customerNotFound.error';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from 'src/users/users.service';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
@Serialize(CustomerResponseDto)
export class CustomersController {
  constructor(
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  @Get('/findAll')
  async findAll() {
    return await this.customersService.findAll();
  }

  @Get('/:company')
  async findCustomer(@Param('company') company: string) {
    try {
      return await this.customersService.findCustomer(company);
    } catch (e: any) {
      console.error(e);

      if (e instanceof CustomerNotFoundError)
        throw new NotFoundException(CustomerExceptionMessage.NOT_FOUND);
    }
  }

  @Post('/create')
  async createCustomer(@Body() body: CreateCustomerDto, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }

    try {
      return await this.customersService.createCustomer(body.company);
    } catch (e: any) {
      if (e instanceof CustomerFoundError)
        throw new BadRequestException(CustomerExceptionMessage.NAME_IN_USE);
    }
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

    try {
      return await this.customersService.updateCustomer(company, body);
    } catch (e: any) {
      throw new NotFoundException(CustomerExceptionMessage.NOT_FOUND);
    }
  }

  @Delete('/delete/:company')
  async deleteCustomer(@Param('company') company: string, @Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (user.role !== 'admin') {
      throw new UnauthorizedException(AuthExceptionMessage.NO_PERMISSION);
    }

    try {
      return await this.customersService.deleteRoom(company);
    } catch (e: any) {
      throw new NotFoundException(CustomerExceptionMessage.NOT_FOUND);
    }
  }
}
