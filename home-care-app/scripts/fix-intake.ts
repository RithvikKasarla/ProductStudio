import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
    const updated = await prisma.intakeRequest.update({
        where: { id: 'cmirrdud9000836ug7myombvc' },
        data: { zip: '10002' }
    });
    console.log('✅ Updated intake ZIP to:', updated.zip);
    await prisma.$disconnect();
}

fix();
