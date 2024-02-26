import { Transform } from 'class-transformer';
import { Meeting } from 'src/meetings/meeting.entity';
import { Token } from 'src/tokens/token.entity';
import { UsersMeetings } from 'src/users-meetings/users-meetings.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserResponseDto } from './dtos/user-response.dto';

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

  @OneToMany(() => UsersMeetings, (usersMeeting) => usersMeeting.user)
  userMeetings: UsersMeetings[];

  @OneToMany(() => Meeting, (meetings) => meetings.subject)
  hasApplied: Meeting[];

  @OneToMany(() => Token, (tokens) => tokens.id)
  tokens: Token[];

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
