import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsRepresentativesService } from './meetings-representatives.service';

describe('MeetingsRepresentativesService', () => {
  let service: MeetingsRepresentativesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingsRepresentativesService],
    }).compile();

    service = module.get<MeetingsRepresentativesService>(MeetingsRepresentativesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
