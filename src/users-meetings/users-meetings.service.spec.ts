import { Test, TestingModule } from '@nestjs/testing';
import { UsersMeetingsService } from './users-meetings.service';

describe('UsersMeetingsService', () => {
  let service: UsersMeetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersMeetingsService],
    }).compile();

    service = module.get<UsersMeetingsService>(UsersMeetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
