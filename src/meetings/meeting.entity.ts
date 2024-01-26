import { MeetingsRepresentatives } from 'src/meetings-representatives/meetings-representatives.entity';
import { Room } from 'src/rooms/room.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.name)
  room: Room;

  @ManyToMany(() => User, (users) => users.name)
  users: User[];

  @ManyToOne(() => MeetingsRepresentatives, (meetingsRepresentatives) => meetingsRepresentatives.id)
  meetingsRepresentatives: MeetingsRepresentatives;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  subject: string;

  @OneToMany(() => User, (applicant) => applicant.name)
  applicant: User;
}
