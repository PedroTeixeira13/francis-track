import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsRepresentativesController } from './meetings-representatives.controller';
import { MeetingsRepresentativesService } from './meetings-representatives.service';

describe('MeetingsRepresentativesController', () => {
  let controller: MeetingsRepresentativesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingsRepresentativesController],
      providers: [MeetingsRepresentativesService],
    }).compile();

    controller = module.get<MeetingsRepresentativesController>(MeetingsRepresentativesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
