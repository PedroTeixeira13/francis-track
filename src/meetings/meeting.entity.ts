import { Customer } from 'src/customers/customer.entity';
import { Room } from 'src/rooms/room.entity';
import { UsersMeetings } from 'src/users-meetings/users-meetings.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.id)
  room: Room;

  @OneToMany(() => UsersMeetings, (usersMeeting) => usersMeeting.meeting, {
    onDelete: 'CASCADE',
  })
  participants: UsersMeetings[];

  @ManyToOne(() => Customer, (customer) => customer.company)
  customer: Customer;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  subject: string;

  @ManyToOne(() => User, (applicant) => applicant.name)
  applicant: User;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
