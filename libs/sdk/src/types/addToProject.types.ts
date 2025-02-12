export type BeneficiaryPayload = {
    uuid: any;
    walletAddress: any;
    extras: any;
    type: string;
    isVerified: any;
}

export type AAPayload = BeneficiaryPayload & {
    gender: string;
    extras: { phone: string } & BeneficiaryPayload['extras']; // Merge extras with phone
}