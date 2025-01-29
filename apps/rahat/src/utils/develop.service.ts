// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DevService {
  constructor() {}
  @Inject('RAHAT_CLIENT') private readonly rahatClient: ClientProxy;

  log(cmd: string, data: any) {
    if (process.env.NODE_ENV === 'production') return;
    this.rahatClient.send({ cmd, dev: true }, data).subscribe();
  }

  async otp(data: any) {
    console.log('otp', data);
    if (process.env.NODE_ENV === 'production') return;
    this.rahatClient
      .send(
        { cmd: 'slack', dev: true },
        {
          otp: data.otp,
          challenge: data.challenge,
          origin: data.requestInfo.origin,
        }
      )
      .subscribe();
  }
}
