import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from 'src/meetings/meeting.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { UsersMeetings } from './users-meetings.entity';

@Injectable()
export class UsersMeetingsService {
  constructor(
    @InjectRepository(UsersMeetings) private repo: Repository<UsersMeetings>,
    private usersService: UsersService,
  ) {}

  async createMeetingUser(users: string[], newMeeting: Meeting) {
    for (const username of users) {
      const newUsersMeetings = this.repo.create();
      newUsersMeetings.user = await this.usersService.findOne(username);
      newUsersMeetings.meeting = newMeeting;
      await this.repo.save(newUsersMeetings);
    }
  }

  async findUserMeeting(id: string) {
    const userMeeting = await this.repo.findOne({
      where: { id },
      relations: { user: true, meeting: true },
    });
    return userMeeting.user.id
  }
}
