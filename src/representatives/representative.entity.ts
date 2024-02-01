import { Customer } from 'src/customers/customer.entity';
import { MeetingsRepresentatives } from 'src/meetings-representatives/meetings-representatives.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Representative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(
    () => MeetingsRepresentatives,
    (meetingsRepresentatives) => meetingsRepresentatives.id,
  )
  meetingsRepresentatives: MeetingsRepresentatives;

  @ManyToOne(() => Customer, (customers) => customers.company)
  company: Customer;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
