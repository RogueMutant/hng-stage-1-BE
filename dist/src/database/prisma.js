"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rawUrl = process.env.DATABASE_URL || 'file:./dev.db';
const connectionString = rawUrl.replace(/^file:/, '');
// Ensure the directory for the SQLite database exists
const dbPath = path_1.default.resolve(connectionString);
const dbDir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dbDir)) {
    fs_1.default.mkdirSync(dbDir, { recursive: true });
}
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({ url: rawUrl });
exports.prisma = new client_1.PrismaClient({ adapter });
