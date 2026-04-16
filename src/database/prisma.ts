import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';

const rawUrl = process.env.DATABASE_URL || 'file:./dev.db';
const connectionString = rawUrl.replace(/^file:/, '');

// Ensure the directory for the SQLite database exists
const dbPath = path.resolve(connectionString);
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const adapter = new PrismaBetterSqlite3({ url: rawUrl });

export const prisma = new PrismaClient({ adapter });
