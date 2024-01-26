import { Meeting } from 'src/meetings/meeting.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column()
  floor: number;

  @OneToMany(() => Meeting, (meetings) => meetings.subject)
  meetings: Meeting[];
}
