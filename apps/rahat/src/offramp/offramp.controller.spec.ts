// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
