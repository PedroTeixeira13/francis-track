import { Meeting } from 'src/meetings/meeting.entity';
import { UsersMeetings } from 'src/users-meetings/users-meetings.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @ManyToOne(() => UsersMeetings, (usersMeetings) => usersMeetings.id)
  meetings: UsersMeetings;

  @OneToMany(() => Meeting, (meetings) => meetings.subject)
  hasApplied: Meeting[];
}
