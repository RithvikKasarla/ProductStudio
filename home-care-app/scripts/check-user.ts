import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const user = await prisma.user.findUnique({
        where: { email: 'rithvik10002@gmail.com' },
    });

    if (!user) {
        console.log('User not found');
        await prisma.$disconnect();
        return;
    }

    console.log('User:', user.name, '| Email:', user.email);
    console.log('User ZIP:', user.zip);

    const intakes = await prisma.intakeRequest.findMany({
        where: { userId: user.id }
    });

    console.log('Intake requests:');
    for (const i of intakes) {
        console.log('  ID:', i.id, '| ZIP:', i.zip, '| Status:', i.status);
    }

    await prisma.$disconnect();
}

check();
