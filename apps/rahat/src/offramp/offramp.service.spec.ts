import { Test, TestingModule } from '@nestjs/testing';
import { OfframpService } from './offramp.service';

describe('OfframpService', () => {
  let service: OfframpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfframpService],
    }).compile();

    service = module.get<OfframpService>(OfframpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
