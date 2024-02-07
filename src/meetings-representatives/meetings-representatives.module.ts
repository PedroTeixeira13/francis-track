import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepresentativesModule } from 'src/representatives/representatives.module';
import { MeetingsRepresentatives } from './meetings-representatives.entity';
import { MeetingsRepresentativesService } from './meetings-representatives.service';

@Module({
  providers: [MeetingsRepresentativesService],
  imports: [
    TypeOrmModule.forFeature([MeetingsRepresentatives]),
    RepresentativesModule,
  ],
  exports: [MeetingsRepresentativesService]
})
export class MeetingsRepresentativesModule {}
