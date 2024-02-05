import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}

  async findAll() {
    const customers = await this.repo.find();
    return customers.filter((customer) => customer.active);
  }

  async findCustomer(company: string) {
    if (!company) {
      return null;
    }
    return this.repo.findOne({ where: { company } });
  }

  async createCustomer(company: string) {
    const customer = this.repo.create({ company });

    return this.repo.save(customer);
  }

  async updateCustomer(company: string, attrs: Partial<Customer>) {
    const customer = await this.repo.findOne({ where: { company } });
    if (!customer) {
      throw new NotFoundException('customer not found');
    }
    Object.assign(customer, attrs);
    return this.repo.save(customer);
  }

  async deleteRoom(company: string) {
    const customer = await this.findCustomer(company);
    if (!customer) {
      throw new NotFoundException('customer not found');
    }
    customer.deletedAt = new Date();
    customer.active = false;

    return this.repo.save(customer);
  }
}
