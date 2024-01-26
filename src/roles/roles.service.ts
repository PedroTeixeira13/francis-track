import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}
}
