import { Test, TestingModule } from '@nestjs/testing';
import { OfframpController } from './offramp.controller';
import { OfframpService } from './offramp.service';

describe('OfframpController', () => {
  let controller: OfframpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfframpController],
      providers: [OfframpService],
    }).compile();

    controller = module.get<OfframpController>(OfframpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
