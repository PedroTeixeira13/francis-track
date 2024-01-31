import { Test, TestingModule } from '@nestjs/testing';
import { UsersMeetingsController } from './users-meetings.controller';
import { UsersMeetingsService } from './users-meetings.service';

describe('UsersMeetingsController', () => {
  let controller: UsersMeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersMeetingsController],
      providers: [UsersMeetingsService],
    }).compile();

    controller = module.get<UsersMeetingsController>(UsersMeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
