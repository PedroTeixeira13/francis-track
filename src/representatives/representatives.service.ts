import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Representative } from './representative.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RepresentativesService {
  constructor(
    @InjectRepository(Representative) private repo: Repository<Representative>,
  ) {}

  async findAll() {
    const representatives = await this.repo.find();
    return representatives.filter((representative) => representative.active);
  }

  async findRepresentative(name: string) {
    if (!name) {
      return null;
    }

    return this.repo.findOne({ where: { name } });
  }

  async createRepresentative(name: string, companyName: string) {
    
  }
}
