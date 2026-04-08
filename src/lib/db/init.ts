import path from "node:path";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";
import { reconcileLegacyAccounts } from "./reconcile-accounts";
import { seedDatabase } from "./seed";

let databaseInitPromise: Promise<void> | null = null;

async function runDatabaseInit(): Promise<void> {
  const migrationsFolder = path.join(process.cwd(), "drizzle");

  await migrate(db, { migrationsFolder });
  await reconcileLegacyAccounts();
  await seedDatabase();
}

export async function initializeDatabase(): Promise<void> {
  if (!databaseInitPromise) {
    databaseInitPromise = runDatabaseInit().catch((error) => {
      databaseInitPromise = null;
      throw error;
    });
  }

  await databaseInitPromise;
}
