import { Meeting } from 'src/meetings/meeting.entity';
import { User } from 'src/users/user.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsersMeetings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (users) => users.name)
  users: User[];

  @OneToMany(() => Meeting, (meetings) => meetings.subject)
  meetings: Meeting[];
}
