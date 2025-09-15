;(async () => {
  const { config } = await import('dotenv');
  config();
  const { config: load } = await import('dotenv');
  load({ path: '.env.local' });
  const { Client } = await import('pg');

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query('begin');
  try {
    await client.query("ALTER TABLE \"contact_requests\" ADD COLUMN IF NOT EXISTS \"status\" text NOT NULL DEFAULT 'nuevo'");
    await client.query('CREATE INDEX IF NOT EXISTS "cr_status_idx" ON "contact_requests" ("status")');
    await client.query('commit');
    console.log('Status column ensured');
  } catch (e) {
    await client.query('rollback');
    console.error('Migration failed:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();

