import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeetingsService {
  constructor(@InjectRepository(Meeting) private repo: Repository<Meeting>) {}
}
