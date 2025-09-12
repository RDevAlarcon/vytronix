require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query('begin');
  try {
    await client.query("ALTER TABLE \"contact_requests\" ADD COLUMN IF NOT EXISTS \"message\" text NOT NULL DEFAULT ''");
    await client.query('commit');
    console.log('Message column ensured');
  } catch (e) {
    await client.query('rollback');
    console.error('Migration failed:', e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
