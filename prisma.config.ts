import { defineConfig } from "@prisma/config";
import "dotenv/config";

const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
const validUrl = rawUrl.startsWith("file:") ? rawUrl : `file:${rawUrl}`;

export default defineConfig({
  datasource: {
    url: validUrl,
  },
});
