import { Module } from '@nestjs/common';
import { MeetingsRepresentativesService } from './meetings-representatives.service';
import { MeetingsRepresentativesController } from './meetings-representatives.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsRepresentatives } from './meetings-representatives.entity';

@Module({
  controllers: [MeetingsRepresentativesController],
  providers: [MeetingsRepresentativesService],
  imports: [TypeOrmModule.forFeature([MeetingsRepresentatives])]
})
export class MeetingsRepresentativesModule {}
