import { Meeting } from 'src/meetings/meeting.entity';
import { Representative } from 'src/representatives/representative.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MeetingsRepresentatives {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Meeting, (meetings) => meetings.subject)
  meetings: Meeting[];

  @OneToMany(() => Representative, (representatives) => representatives.company)
  representatives: Representative[];
}
