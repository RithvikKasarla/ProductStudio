import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️  Clearing database...');

    // Delete in order to respect foreign key constraints

    // 1. Visit Events (depend on Booking)
    const deletedVisits = await prisma.visitEvent.deleteMany();
    console.log(`Deleted ${deletedVisits.count} visit events.`);

    // 2. Bookings (depend on Intake, Family, CaregiverProfile, CaregiverUser, AvailabilitySlot)
    const deletedBookings = await prisma.booking.deleteMany();
    console.log(`Deleted ${deletedBookings.count} bookings.`);

    // 3. Availability Slots (depend on CaregiverProfile)
    const deletedSlots = await prisma.availabilitySlot.deleteMany();
    console.log(`Deleted ${deletedSlots.count} availability slots.`);

    // 4. Intake Requests (depend on User)
    const deletedIntakes = await prisma.intakeRequest.deleteMany();
    console.log(`Deleted ${deletedIntakes.count} intake requests.`);

    // 5. Caregiver Profiles (depend on User)
    const deletedProfiles = await prisma.caregiverProfile.deleteMany();
    console.log(`Deleted ${deletedProfiles.count} caregiver profiles.`);

    // 6. Users (root)
    const deletedUsers = await prisma.user.deleteMany();
    console.log(`Deleted ${deletedUsers.count} users.`);

    console.log('✅ Database cleared successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
