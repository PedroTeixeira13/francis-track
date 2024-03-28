import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Representative } from './representative.entity';
import { Repository } from 'typeorm';
import { CustomersService } from 'src/customers/customers.service';
import { RepresentativesExceptionMessage } from 'src/common/enums/errorMessages.enum';
import { RepresentativeNotFoundError } from 'src/errors/representativeNotFound.error';
import { RepresentativeFoundError } from 'src/errors/representativeFound.error';

@Injectable()
export class RepresentativesService {
  constructor(
    @InjectRepository(Representative) private repo: Repository<Representative>,
    private customersService: CustomersService,
  ) {}

  async findAll() {
    const representatives = await this.repo.find({
      relations: { company: true },
    });
    return representatives.filter((representative) => representative.active);
  }

  async findOne(name: string): Promise<Representative | undefined> {
    const representative = await this.repo.findOne({
      where: { name },
      relations: { company: true },
    });
    if (!representative || !representative.active) {
      throw new RepresentativeNotFoundError();
    }
    return representative;
  }

  async checkOne(name: string) {
    return await this.repo.findOne({ where: { name } });
  }

  async create(name: string, company: string) {
    const representatives = await this.checkOne(name);
    if (representatives !== null) {
      throw new RepresentativeFoundError();
    }

    const realCompany = await this.customersService.findCustomer(company);

    const representative = new Representative();
    representative.name = name;
    representative.company = realCompany;
    this.repo.create(representative);
    return this.repo.save(representative);
  }

  async update(name: string, attrs: Partial<Representative>) {
    const representative = await this.repo.findOne({ where: { name } });
    if (!representative) {
      throw new RepresentativeNotFoundError()
    }
    Object.assign(representative, attrs);
    return this.repo.save(representative);
  }

  async delete(name: string) {
    const representative = await this.repo.findOne({ where: { name } });
    if (!representative) {
      throw new RepresentativeNotFoundError()
    }
    representative.active = false;
    representative.deletedAt = new Date();
    return this.repo.save(representative);
  }
}
