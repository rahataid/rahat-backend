// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

// noew object created in every request
// garbage collected after end of request
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
    constructor(@Inject(REQUEST) private request: any) { }

    getRequest() {
        return this.request;
    }

    getUser() {
        return this.request.user;
    }
}
