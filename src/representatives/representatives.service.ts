import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Representative } from './representative.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RepresentativesService {
  constructor(
    @InjectRepository(Representative) private repo: Repository<Representative>,
  ) {}
}
