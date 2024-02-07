import { Module } from '@nestjs/common';
import { RepresentativesController } from './representatives.controller';
import { RepresentativesService } from './representatives.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Representative } from './representative.entity';
import { CustomersModule } from 'src/customers/customers.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Representative]), CustomersModule, UsersModule],
  controllers: [RepresentativesController],
  providers: [RepresentativesService],
  exports: [RepresentativesService]
})
export class RepresentativesModule {}
