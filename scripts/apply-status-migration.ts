import 'dotenv/config';
import { config as load } from 'dotenv';
load({ path: '.env.local' });
import { Client } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query('begin');
  try {
    await client.query('ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "status" text NOT NULL DEFAULT \'' + 'nuevo' + '\'' );
    await client.query('CREATE INDEX IF NOT EXISTS "cr_status_idx" ON "contact_requests" ("status")');
    await client.query('commit');
    console.log('Status column ensured');
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error('Migration failed:', e.message); process.exit(1); });

