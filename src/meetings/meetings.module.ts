import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting])],
  controllers: [MeetingsController],
  providers: [MeetingsService]
})
export class MeetingsModule {}
