import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepresentativesModule } from 'src/representatives/representatives.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersMeetingsModule } from 'src/users-meetings/users-meetings.module';
import { UsersModule } from 'src/users/users.module';
import { Meeting } from './meeting.entity';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { MeetingsRepresentativesModule } from 'src/meetings-representatives/meetings-representatives.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    UsersModule,
    RoomsModule,
    RepresentativesModule,
    UsersMeetingsModule,
    MeetingsRepresentativesModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
