import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsModule } from 'src/meetings/meetings.module';
import { UsersModule } from 'src/users/users.module';
import { UsersMeetings } from './users-meetings.entity';
import { UsersMeetingsService } from './users-meetings.service';

@Module({
  providers: [UsersMeetingsService],
  imports: [
    TypeOrmModule.forFeature([UsersMeetings]),
    UsersModule,
    forwardRef(() => MeetingsModule),
  ],
  exports: [UsersMeetingsService],
})
export class UsersMeetingsModule {}
