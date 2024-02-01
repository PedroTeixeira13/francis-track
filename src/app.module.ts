import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { Customer } from './customers/customer.entity';
import { CustomersModule } from './customers/customers.module';
import { MeetingsRepresentatives } from './meetings-representatives/meetings-representatives.entity';
import { MeetingsRepresentativesModule } from './meetings-representatives/meetings-representatives.module';
import { Meeting } from './meetings/meeting.entity';
import { MeetingsModule } from './meetings/meetings.module';
import { Representative } from './representatives/representative.entity';
import { RepresentativesModule } from './representatives/representatives.module';
import { Room } from './rooms/room.entity';
import { RoomsModule } from './rooms/rooms.module';
import { UsersMeetings } from './users-meetings/users-meetings.entity';
import { UsersMeetingsModule } from './users-meetings/users-meetings.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'francis-track',
      username: 'root',
      password: 'root',
      entities: [
        Customer,
        Meeting,
        Representative,
        Room,
        User,
        MeetingsRepresentatives,
        UsersMeetings,
      ],
      synchronize: true,
    }),
    UsersModule,
    RoomsModule,
    CustomersModule,
    RepresentativesModule,
    MeetingsModule,
    CustomersModule,
    MeetingsRepresentativesModule,
    AuthModule,
    UsersMeetingsModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    AuthService,
  ],
})
export class AppModule {}
