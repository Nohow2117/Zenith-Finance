import { createClient } from "@libsql/client";

async function run() {
  const client = createClient({ url: process.env.TURSO_DATABASE_URL || "file:local.db" });
  try {
    await client.execute("ALTER TABLE accounts ADD COLUMN is_active INTEGER DEFAULT 1 NOT NULL;");
    console.log("Added is_active column successfully");
  } catch (e) {
    console.log("Column may already exist or error:", e);
  }
}

run();
