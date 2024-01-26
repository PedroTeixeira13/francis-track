import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Customer } from './customers/customer.entity';
import { CustomersModule } from './customers/customers.module';
import { MeetingsRepresentatives } from './meetings-representatives/meetings-representatives.entity';
import { MeetingsRepresentativesModule } from './meetings-representatives/meetings-representatives.module';
import { Meeting } from './meetings/meeting.entity';
import { MeetingsModule } from './meetings/meetings.module';
import { Representative } from './representatives/representative.entity';
import { RepresentativesModule } from './representatives/representatives.module';
import { Role } from './roles/role.entity';
import { RolesModule } from './roles/roles.module';
import { Room } from './rooms/room.entity';
import { RoomsModule } from './rooms/rooms.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'francis-track',
      username: 'root',
      password: 'root',
      entities: [Customer, Meeting, Representative, Role, Room, User, MeetingsRepresentatives],
      synchronize: true
    }),
    UsersModule,
    RoomsModule,
    CustomersModule,
    RepresentativesModule,
    RolesModule,
    MeetingsModule,
    CustomersModule,
    MeetingsRepresentativesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
