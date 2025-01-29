// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@rumsan/prisma';
import { recoverMessageAddress } from 'viem';
import { CHECK_HEADERS_KEY } from './headers.decorator';

@Injectable()
export class ExternalAppGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const headersToCheck = this.reflector.get<string[]>(CHECK_HEADERS_KEY, context.getHandler());

        if (!headersToCheck) return true;
        const request = context.switchToHttp().getRequest();

        for (const header of headersToCheck) {
            const signature = request.headers['auth-signature'];
            const address = request.headers['auth-address'];

            if (!signature || !address) throw new ForbiddenException(`Missing required headers!`);

            const row = await this.prisma.authApp.findUnique({
                where: { address, deletedAt: null }
            });
            if (!row) throw new ForbiddenException(`Invalid auth address!`);

            const recoverAddress = await recoverMessageAddress({
                message: row.nonceMessage,
                signature,
            });

            const isValid = recoverAddress === address;
            if (!isValid) throw new ForbiddenException(`You dont have access to do that!`);
        }

        return true;
    }
}
