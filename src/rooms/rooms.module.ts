import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomsService],
})
export class RoomsModule {}
