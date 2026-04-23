"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./prisma");
const uuid_1 = require("uuid");
const GENDERS = ['male', 'female'];
const AGE_GROUPS = ['child', 'teenager', 'adult', 'senior'];
const COUNTRIES = [
    { id: 'NG', name: 'Nigeria' },
    { id: 'KE', name: 'Kenya' },
    { id: 'AO', name: 'Angola' },
    { id: 'US', name: 'United States' },
    { id: 'GB', name: 'United Kingdom' },
    { id: 'CA', name: 'Canada' },
    { id: 'ZA', name: 'South Africa' },
    { id: 'GH', name: 'Ghana' },
];
async function seed() {
    console.log('Starting seed process for 2026 records...');
    const totalToSeed = 2026;
    const batchSize = 100;
    for (let i = 0; i < totalToSeed; i += batchSize) {
        const batch = [];
        const end = Math.min(i + batchSize, totalToSeed);
        for (let j = i + 1; j <= end; j++) {
            const name = `user_profile_${j}`.toLowerCase();
            const gender = GENDERS[j % GENDERS.length];
            const country = COUNTRIES[j % COUNTRIES.length];
            const age = 10 + (j % 70); // Ages between 10 and 79
            let age_group = 'adult';
            if (age < 13)
                age_group = 'child';
            else if (age < 20)
                age_group = 'teenager';
            else if (age >= 60)
                age_group = 'senior';
            batch.push({
                id: (0, uuid_1.v4)(),
                name,
                gender,
                gender_probability: parseFloat((0.5 + Math.random() * 0.5).toFixed(4)),
                age,
                age_group,
                country_id: country.id,
                country_name: country.name,
                country_probability: parseFloat((0.5 + Math.random() * 0.5).toFixed(4)),
                created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
            });
        }
        // SQLite in Prisma supports createMany but skipDuplicates is only for some providers.
        // For idempotency, we can use a raw query or just catch errors.
        // Given the requirement to use ON CONFLICT DO NOTHING, raw query is best.
        for (const record of batch) {
            await prisma_1.prisma.$executeRaw `
            INSERT INTO Profile (id, name, gender, gender_probability, age, age_group, country_id, country_name, country_probability, created_at)
            VALUES (${record.id}, ${record.name}, ${record.gender}, ${record.gender_probability}, ${record.age}, ${record.age_group}, ${record.country_id}, ${record.country_name}, ${record.country_probability}, ${record.created_at})
            ON CONFLICT(name) DO NOTHING;
        `;
        }
        console.log(`Processed ${end} / ${totalToSeed} records`);
    }
    console.log('Seeding completed successfully.');
}
seed()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
