import { Module } from '@nestjs/common';
import { RepresentativesController } from './representatives.controller';
import { RepresentativesService } from './representatives.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Representative } from './representative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Representative])],
  controllers: [RepresentativesController],
  providers: [RepresentativesService],
  exports: [RepresentativesService]
})
export class RepresentativesModule {}
