import { Meeting } from 'src/meetings/meeting.entity';
import { Representative } from 'src/representatives/representative.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @OneToMany(() => Representative, (representatives) => representatives.name)
  representatives: Representative[];

  @OneToMany(() => Meeting, (meetings) => meetings.subject)
  meetings: Meeting[];

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
