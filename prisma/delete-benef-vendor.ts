import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PROJECT_ID = ''

async function main() {
    // const beneficiaries = await prisma.beneficiaryProject.findMany({
    //     where: {
    //         projectId: PROJECT_ID
    //     }, select: { beneficiaryId: true }
    // });

    // const vendors = await prisma.projectVendors.findMany({
    //     where: {
    //         projectId: PROJECT_ID
    //     }, select: { vendorId: true }
    // });

    // return deleteBenefData(beneficiaries);
    // return deleteVendorData(vendors);
}

async function deleteBenefData(beneficiaries: any[]) {
    for (const b of beneficiaries) {
        const currentBenef = await prisma.beneficiary.findUnique({
            where: {
                uuid: b.beneficiaryId
            }, select: { id: true, uuid: true }
        });
        console.log("CurrentBenef:", currentBenef);

        // // 1. Delete from project
        await prisma.beneficiaryProject.deleteMany({
            where: {
                projectId: PROJECT_ID,
                beneficiaryId: currentBenef?.uuid
            }
        });

        // // 2. Delete from PII
        await prisma.beneficiaryPii.delete({
            where: {
                beneficiaryId: currentBenef?.id
            }
        });

        // // 3. Delete from beneficiary
        await prisma.beneficiary.delete({
            where: {
                id: currentBenef?.id
            }
        });
    }
    console.log("Beneficiaries Deleted");
}

async function deleteVendorData(vendors: any[]) {
    for (let v of vendors) {

        const currentVendor = await prisma.user.findUnique({
            where: {
                uuid: v.vendorId
            }, select: { id: true, uuid: true, name: true }
        });
        console.log("CurrentVendor:", currentVendor);
        if (!currentVendor) return;

        // 1. Delete from project
        await prisma.projectVendors.deleteMany({
            where: {
                vendorId: currentVendor.uuid
            }
        });
        console.log("Delete from project");

        // // 2. Delete From Auth
        await prisma.auth.deleteMany({
            where: {
                userId: currentVendor?.id
            }
        });
        console.log("Delete from auth");

        // 3. Delete from UserRole
        await prisma.userRole.deleteMany({
            where: {
                userId: currentVendor?.id
            }
        });
        console.log("Delete from userole");


        // 4. Delete from User
        await prisma.user.delete({
            where: {
                id: currentVendor?.id
            }
        });
        console.log("Delete from user");
    }

}



main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });





