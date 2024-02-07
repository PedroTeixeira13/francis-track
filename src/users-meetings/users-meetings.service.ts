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
    const newUsersMeetings = this.repo.create();
    let foundedUsers: any[] = newUsersMeetings.users;

    for (const username of users) {
      const foundUser = await this.usersService.findOne(username);
      foundedUsers = [foundedUsers, foundUser];
    }
    newUsersMeetings.users = foundedUsers;

    newUsersMeetings.meetings = [newMeeting];

    return this.repo.save(newUsersMeetings);
  }
}
