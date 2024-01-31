import { Module } from '@nestjs/common';
import { UsersMeetingsService } from './users-meetings.service';
import { UsersMeetingsController } from './users-meetings.controller';

@Module({
  controllers: [UsersMeetingsController],
  providers: [UsersMeetingsService],
})
export class UsersMeetingsModule {}
