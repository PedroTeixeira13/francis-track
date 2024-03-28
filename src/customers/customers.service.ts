import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerFoundError } from 'src/errors/customerFound.error';
import { CustomerNotFoundError } from 'src/errors/customerNotFound.error';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}

  async findAll() {
    const customers = await this.repo.find({
      relations: { representatives: true },
    });
    return customers.filter((customer) => customer.active);
  }

  async findCustomer(company: string) {
    const customer = await this.repo.findOne({
      where: { company },
      relations: { representatives: true },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }
    return customer;
  }

  async createCustomer(company: string) {
    const customers = await this.repo.findOne({ where: { company } });
    if (customers) {
      throw new CustomerFoundError();
    }
    const customer = this.repo.create({ company });

    return this.repo.save(customer);
  }

  async updateCustomer(company: string, attrs: Partial<Customer>) {
    const customer = await this.repo.findOne({ where: { company } });
    if (!customer) {
      throw new CustomerNotFoundError();
    }
    Object.assign(customer, attrs);
    return this.repo.save(customer);
  }

  async deleteRoom(company: string) {
    const customer = await this.repo.findOne({
      where: { company },
      relations: { representatives: true },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    return this.repo.save(customer);
  }
}
