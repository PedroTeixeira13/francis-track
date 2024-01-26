import { Customer } from 'src/customers/customer.entity';
import { MeetingsRepresentatives } from 'src/meetings-representatives/meetings-representatives.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
