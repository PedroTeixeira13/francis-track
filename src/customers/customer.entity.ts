import { Representative } from 'src/representatives/representative.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @OneToMany(() => Representative, (representatives) => representatives.name)
  representatives: Representative[];
}