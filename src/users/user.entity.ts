import { Meeting } from 'src/meetings/meeting.entity';
import { Role } from 'src/roles/role.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.name)
  role: Role;

  @ManyToMany(() => Meeting, (meetings) => meetings.subject)
  meetings: Meeting[]

  @ManyToOne(() => Meeting, (meetings) => meetings.subject)
  hasApplied: Meeting[]
}
