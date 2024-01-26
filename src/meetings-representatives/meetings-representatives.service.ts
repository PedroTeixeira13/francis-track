import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingsRepresentatives } from './meetings-representatives.entity';

@Injectable()
export class MeetingsRepresentativesService {
  constructor(@InjectRepository(MeetingsRepresentatives) private repo: Repository<MeetingsRepresentatives>) {}
}
