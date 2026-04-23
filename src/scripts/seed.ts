import { v7 as uuidv7 } from 'uuid';
import * as dotenv from 'dotenv';
import { prisma } from '../database/prisma';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function main() {
  const seedFilePath = path.join(__dirname, '../seeds/seed_profiles.json');
  console.log(`🌱 Seeding records from ${seedFilePath}...`);
  
  const rawData = fs.readFileSync(seedFilePath, 'utf8');
  const { profiles } = JSON.parse(rawData);
  const totalRecords = profiles.length;
  
  const batchSize = 100;
  for (let i = 0; i < totalRecords; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, totalRecords - i);
    const batch = profiles.slice(i, i + currentBatchSize);
    
    for (const profile of batch) {
      // Normalize name for idempotency lookup
      const name = profile.name.trim().toLowerCase();
      
      await prisma.profile.upsert({
        where: { name },
        update: {}, // No updates if exists
        create: {
          id: uuidv7(),
          name,
          gender: profile.gender,
          gender_probability: profile.gender_probability,
          age: profile.age,
          age_group: profile.age_group,
          country_id: profile.country_id,
          country_name: profile.country_name,
          country_probability: profile.country_probability,
          created_at: new Date(),
        },
      });
    }
    console.log(`✅ Progress: ${Math.min(i + batchSize, totalRecords)}/${totalRecords}`);
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
