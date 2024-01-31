import { MeetingsRepresentatives } from 'src/meetings-representatives/meetings-representatives.entity';
import { Room } from 'src/rooms/room.entity';
import { UsersMeetings } from 'src/users-meetings/users-meetings.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.name)
  room: Room;

  @ManyToOne(() => UsersMeetings, (usersMeetings) => usersMeetings.id)
  users: UsersMeetings;

  @ManyToOne(
    () => MeetingsRepresentatives,
    (meetingsRepresentatives) => meetingsRepresentatives.id,
  )
  meetingsRepresentatives: MeetingsRepresentatives;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  subject: string;

  @ManyToOne(() => User, (applicant) => applicant.name)
  applicant: User;
}
