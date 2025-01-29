// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { PrismaClient } from "@prisma/client";

export const findTempBenefGroups = async (prisma: PrismaClient, groupUUID: string) => {
    return await prisma.tempBeneficiaryGroup.findMany({
        where: {
            tempGroupUID: groupUUID
        },
        include: {
            tempBeneficiary: true
        }
    });
}

export const validateDupicatePhone = async (prisma: PrismaClient, beneficiaries: any[]) => {
    const existing = await prisma.beneficiaryPii.findMany({
        select: { beneficiaryId: true, phone: true }
    });
    const combined_benef = [...existing, ...beneficiaries];
    return checkDuplicatePhones(combined_benef);
}

export const validateDupicateWallet = async (prisma: PrismaClient, beneficiaries: any[]) => {
    const existing = await prisma.beneficiary.findMany({
        select: { id: true, walletAddress: true }
    });
    const combined_benef = [...existing, ...beneficiaries];
    return checkDuplicateWallet(combined_benef);
}



function checkDuplicatePhones(arr: any[]) {
    const duplicates = [];
    const phoneSet = new Set();

    for (const obj of arr) {
        if (phoneSet.has(obj.phone)) {
            duplicates.push(obj.phone);
        }
        phoneSet.add(obj.phone);
    }

    return duplicates;
}

function checkDuplicateWallet(arr: any[]) {
    const duplicates = [];
    const walletSet = new Set();

    for (const obj of arr) {
        if (walletSet.has(obj.walletAddress)) {
            duplicates.push(obj.walletAddress);
        }
        walletSet.add(obj.walletAddress);
    }

    return duplicates;
}