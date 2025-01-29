// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
// email.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MessageSenderService {
    private readonly url
    constructor(
        private readonly configService: ConfigService,
    ) {
        this.url = this.configService.get('MESSAGE_SENDER_API');
    }

    async sendWhatappMessage(
        payload
    ): Promise<void> {

        axios.post(this.url, payload).catch((error) => {
            console.error(error);
        });
    }
}
