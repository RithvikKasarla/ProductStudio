import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sample nurse data with diverse backgrounds
const SAMPLE_NURSES = [
    {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '(555) 123-4567',
        zip: '10001',
        caregiverType: 'RN' as const,
        yearsExperience: 8,
        hourlyRate: 110,
        skills: ['Dementia Care', 'Wound Care', 'Medication reminders', 'Bathing'],
        languages: ['English', 'Spanish'],
        bio: 'Experienced registered nurse with 8 years in home healthcare. Specialized in dementia care and post-operative recovery. Passionate about providing compassionate, personalized care.',
        availability: [
            { dayOfWeek: 1, startMinutes: 8 * 60, endMinutes: 16 * 60 }, // Mon 8am-4pm
            { dayOfWeek: 2, startMinutes: 8 * 60, endMinutes: 16 * 60 }, // Tue
            { dayOfWeek: 3, startMinutes: 8 * 60, endMinutes: 16 * 60 }, // Wed
            { dayOfWeek: 4, startMinutes: 8 * 60, endMinutes: 16 * 60 }, // Thu
            { dayOfWeek: 5, startMinutes: 8 * 60, endMinutes: 14 * 60 }, // Fri 8am-2pm
        ],
    },
    {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '(555) 234-5678',
        zip: '10002',
        caregiverType: 'LPN' as const,
        yearsExperience: 5,
        hourlyRate: 90,
        skills: ['Medication reminders', 'Transfers', 'Physical Therapy', 'Meals'],
        languages: ['English', 'Mandarin'],
        bio: 'Licensed practical nurse with expertise in mobility assistance and physical therapy support. Known for patience and excellent communication with patients and families.',
        availability: [
            { dayOfWeek: 1, startMinutes: 10 * 60, endMinutes: 18 * 60 }, // Mon 10am-6pm
            { dayOfWeek: 3, startMinutes: 10 * 60, endMinutes: 18 * 60 }, // Wed
            { dayOfWeek: 5, startMinutes: 10 * 60, endMinutes: 18 * 60 }, // Fri
            { dayOfWeek: 6, startMinutes: 9 * 60, endMinutes: 15 * 60 },  // Sat 9am-3pm
        ],
    },
    {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '(555) 345-6789',
        zip: '10003',
        caregiverType: 'CNA' as const,
        yearsExperience: 3,
        hourlyRate: 70,
        skills: ['Bathing', 'Toileting', 'Meals', 'Light housekeeping', 'Transfers'],
        languages: ['English', 'Spanish', 'Portuguese'],
        bio: 'Certified nursing assistant dedicated to providing excellent daily care. Bilingual and experienced with elderly patients. Reliable and friendly.',
        availability: [
            { dayOfWeek: 0, startMinutes: 7 * 60, endMinutes: 15 * 60 },  // Sun 7am-3pm
            { dayOfWeek: 1, startMinutes: 7 * 60, endMinutes: 15 * 60 },  // Mon
            { dayOfWeek: 2, startMinutes: 7 * 60, endMinutes: 15 * 60 },  // Tue
            { dayOfWeek: 3, startMinutes: 7 * 60, endMinutes: 15 * 60 },  // Wed
            { dayOfWeek: 4, startMinutes: 7 * 60, endMinutes: 15 * 60 },  // Thu
        ],
    },
    {
        name: 'James Williams',
        email: 'james.williams@example.com',
        phone: '(555) 456-7890',
        zip: '10004',
        caregiverType: 'HHA' as const,
        yearsExperience: 6,
        hourlyRate: 60,
        skills: ['Meals', 'Light housekeeping', 'Medication reminders', 'Transfers'],
        languages: ['English'],
        bio: 'Home health aide with 6 years of experience. Specializes in meal preparation and daily living assistance. Great with companionship and keeping patients engaged.',
        availability: [
            { dayOfWeek: 2, startMinutes: 12 * 60, endMinutes: 20 * 60 }, // Tue 12pm-8pm
            { dayOfWeek: 3, startMinutes: 12 * 60, endMinutes: 20 * 60 }, // Wed
            { dayOfWeek: 4, startMinutes: 12 * 60, endMinutes: 20 * 60 }, // Thu
            { dayOfWeek: 5, startMinutes: 12 * 60, endMinutes: 20 * 60 }, // Fri
            { dayOfWeek: 6, startMinutes: 10 * 60, endMinutes: 18 * 60 }, // Sat 10am-6pm
        ],
    },
    {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@example.com',
        phone: '(555) 567-8901',
        zip: '10005',
        caregiverType: 'RN' as const,
        yearsExperience: 12,
        hourlyRate: 120,
        skills: ['Wound Care', 'Palliative Care', 'Dementia Care', 'Post-Op', 'Medication reminders'],
        languages: ['English', 'French'],
        bio: 'Senior registered nurse with over a decade of experience in home healthcare. Board certified in wound care and palliative care. Trusted by dozens of families.',
        availability: [
            { dayOfWeek: 1, startMinutes: 9 * 60, endMinutes: 17 * 60 },  // Mon 9am-5pm
            { dayOfWeek: 2, startMinutes: 9 * 60, endMinutes: 17 * 60 },  // Tue
            { dayOfWeek: 4, startMinutes: 9 * 60, endMinutes: 17 * 60 },  // Thu
        ],
    },
];

async function clearDatabase() {
    console.log('🗑️  Clearing database...');

    const deletedVisits = await prisma.visitEvent.deleteMany();
    console.log(`   Deleted ${deletedVisits.count} visit events.`);

    const deletedBookings = await prisma.booking.deleteMany();
    console.log(`   Deleted ${deletedBookings.count} bookings.`);

    const deletedSlots = await prisma.availabilitySlot.deleteMany();
    console.log(`   Deleted ${deletedSlots.count} availability slots.`);

    const deletedIntakes = await prisma.intakeRequest.deleteMany();
    console.log(`   Deleted ${deletedIntakes.count} intake requests.`);

    const deletedProfiles = await prisma.caregiverProfile.deleteMany();
    console.log(`   Deleted ${deletedProfiles.count} caregiver profiles.`);

    const deletedUsers = await prisma.user.deleteMany();
    console.log(`   Deleted ${deletedUsers.count} users.`);

    console.log('✅ Database cleared.\n');
}

async function seedNurses() {
    console.log('👩‍⚕️ Creating sample nurse accounts...\n');

    const password = await bcrypt.hash('password123', 10);

    for (const nurse of SAMPLE_NURSES) {
        const user = await prisma.user.create({
            data: {
                name: nurse.name,
                email: nurse.email,
                phone: nurse.phone,
                zip: nurse.zip,
                password,
                role: 'CAREGIVER',
                caregiverProfile: {
                    create: {
                        caregiverType: nurse.caregiverType,
                        yearsExperience: nurse.yearsExperience,
                        hourlyRate: nurse.hourlyRate,
                        skills: nurse.skills,
                        languages: nurse.languages,
                        bio: nurse.bio,
                        boroughsServed: [],
                        verificationStatus: 'APPROVED',
                        availabilitySlots: {
                            create: nurse.availability,
                        },
                    },
                },
            },
            include: {
                caregiverProfile: true,
            },
        });

        console.log(`   ✓ Created ${nurse.name} (${nurse.caregiverType}) - ${nurse.email}`);
    }

    console.log(`\n✅ Created ${SAMPLE_NURSES.length} nurse accounts.`);
    console.log('\n📋 Login credentials for all nurses:');
    console.log('   Password: password123');
    console.log('\n📧 Email addresses:');
    SAMPLE_NURSES.forEach(n => console.log(`   - ${n.email}`));
}

async function main() {
    console.log('\n🏥 Home Care App - Database Seed Script\n');
    console.log('='.repeat(50) + '\n');

    await clearDatabase();
    await seedNurses();

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Database seeded successfully!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
