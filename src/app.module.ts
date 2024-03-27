import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { Customer } from './customers/customer.entity';
import { CustomersModule } from './customers/customers.module';
import { Meeting } from './meetings/meeting.entity';
import { MeetingsModule } from './meetings/meetings.module';
import { Representative } from './representatives/representative.entity';
import { RepresentativesModule } from './representatives/representatives.module';
import { Room } from './rooms/room.entity';
import { RoomsController } from './rooms/rooms.controller';
import { RoomsModule } from './rooms/rooms.module';
import { Token } from './tokens/token.entity';
import { TokensModule } from './tokens/tokens.module';
import { UsersMeetings } from './users-meetings/users-meetings.entity';
import { UsersMeetingsModule } from './users-meetings/users-meetings.module';
import { User } from './users/user.entity';
import { UsersController } from './users/users.controller';
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
      entities: [
        Customer,
        Meeting,
        Representative,
        Room,
        User,
        UsersMeetings,
        Token,
      ],
      synchronize: true,
    }),
    UsersModule,
    RoomsModule,
    CustomersModule,
    RepresentativesModule,
    MeetingsModule,
    CustomersModule,
    AuthModule,
    UsersMeetingsModule,
    TokensModule
  ],
  controllers: [AppController, UsersController, RoomsController],
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
