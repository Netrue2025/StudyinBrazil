const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.$queryRawUnsafe(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='University'"
  );
  if (Array.isArray(existing) && existing.length > 0) {
    console.log("SQLite schema already exists; skipping manual migration.");
    return;
  }

  const migrationName = "20260602114000_init";
  const sqlPath = path.join(process.cwd(), "prisma", "migrations", migrationName, "migration.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  const statements = sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }

  await prisma.$executeRawUnsafe(
    "INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES (?, ?, CURRENT_TIMESTAMP, ?, NULL, NULL, CURRENT_TIMESTAMP, 1)",
    crypto.randomUUID(),
    crypto.createHash("sha256").update(sql).digest("hex"),
    migrationName
  );

  console.log("SQLite schema applied from migration.sql.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
