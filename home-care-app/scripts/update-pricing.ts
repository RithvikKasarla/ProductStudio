const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting pricing update...');

    const caregivers = await prisma.caregiverProfile.findMany();
    console.log(`Found ${caregivers.length} caregivers.`);

    for (const cg of caregivers) {
        let newRate = 60; // Default / HHA
        switch (cg.caregiverType) {
            case 'RN':
                newRate = 110;
                break;
            case 'LPN':
                newRate = 90;
                break;
            case 'CNA':
                newRate = 70;
                break;
            case 'HHA':
                newRate = 60;
                break;
        }

        if (cg.hourlyRate !== newRate) {
            console.log(`Updating ${cg.id} (${cg.caregiverType}) from $${cg.hourlyRate} to $${newRate}`);
            await prisma.caregiverProfile.update({
                where: { id: cg.id },
                data: { hourlyRate: newRate },
            });
        } else {
            console.log(`Skipping ${cg.id} (${cg.caregiverType}) - already at $${newRate}`);
        }
    }

    console.log('Pricing update complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
