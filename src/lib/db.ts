import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getResolvedDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

  // If using SQLite
  if (envUrl.startsWith("file:")) {
    const isServerless = Boolean(
      process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION
    );

    if (isServerless) {
      const tmpPath = "/tmp/dev.db";

      // On serverless, ensure we have a writable copy in /tmp
      if (!fs.existsSync(tmpPath)) {
        const potentialSources = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "dev.db"),
          "/var/task/prisma/dev.db",
          "/var/task/dev.db",
        ];

        let copied = false;
        for (const src of potentialSources) {
          try {
            if (fs.existsSync(/*turbopackIgnore: true*/ src)) {
              fs.copyFileSync(src, tmpPath);
              copied = true;
              break;
            }
          } catch {
            // Ignore error and continue searching
          }
        }

        if (!copied) {
          console.warn("Could not find source dev.db to copy to /tmp. Initializing fallback.");
        }
      }

      return `file:${tmpPath}`;
    }

    // Local runtime: normalize relative paths to absolute so CWD changes don't break connection
    const prismaDb = path.join(process.cwd(), "prisma", "dev.db");
    if (fs.existsSync(/*turbopackIgnore: true*/ prismaDb)) return `file:${prismaDb}`;
    const rootDb = path.join(process.cwd(), "dev.db");
    if (fs.existsSync(/*turbopackIgnore: true*/ rootDb)) return `file:${rootDb}`;
  }

  return envUrl;
}

const activeDbUrl = getResolvedDatabaseUrl();
process.env.DATABASE_URL = activeDbUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
