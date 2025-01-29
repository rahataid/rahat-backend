// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { SetMetadata } from '@nestjs/common';

export const CHECK_HEADERS_KEY = 'checkHeaders';

export const CheckHeaders = (...headers: string[]) => SetMetadata(CHECK_HEADERS_KEY, headers);
