import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from 'src/meetings/meeting.entity';
import { RepresentativesService } from 'src/representatives/representatives.service';
import { Repository } from 'typeorm';
import { MeetingsRepresentatives } from './meetings-representatives.entity';

@Injectable()
export class MeetingsRepresentativesService {
  constructor(
    @InjectRepository(MeetingsRepresentatives)
    private repo: Repository<MeetingsRepresentatives>,
    private representativesService: RepresentativesService,
  ) {}

  async createMeetingRepresentative(
    representatives: string[],
    newMeeting: Meeting,
  ) {
    const newUsersMeetings = this.repo.create();
    let foundedRepresentatives: any[] = newUsersMeetings.representatives;
    for (const name of representatives) {
      const foundRepresentative =
        await this.representativesService.findOne(name);
      foundedRepresentatives = [foundedRepresentatives, foundRepresentative];
    }
    newUsersMeetings.representatives = foundedRepresentatives;

    newUsersMeetings.meetings = [newMeeting];

    return this.repo.save(newUsersMeetings);
  }
}
