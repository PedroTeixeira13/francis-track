import { Meeting } from 'src/meetings/meeting.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class UsersMeetings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userMeetings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Meeting, (meeting) => meeting.participants, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;
}
