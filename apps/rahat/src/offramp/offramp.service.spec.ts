// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
