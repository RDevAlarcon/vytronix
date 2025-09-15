;(async () => {
  const { config } = await import('dotenv');
  config();
  const { config: load } = await import('dotenv');
  load({ path: '.env.local' });

  const { Client } = await import('pg');
  const bcrypt = (await import('bcrypt')).default;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your env to seed admin');
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  try {
    const exists = await client.query('select id, email, role from users where email=$1 limit 1', [ADMIN_EMAIL]);
    if (exists.rows.length) {
      const row = exists.rows[0];
      console.log(`Admin already exists: ${row.email} (role=${row.role})`);
      return;
    }

    const id = (globalThis.crypto?.randomUUID?.() || require('crypto').randomUUID()).toString();
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await client.query(
      'insert into users (id, email, name, password_hash, role) values ($1, $2, $3, $4, $5)',
      [id, ADMIN_EMAIL, ADMIN_NAME, passwordHash, 'admin']
    );

    console.log(`Admin created: ${ADMIN_EMAIL}`);
  } finally {
    await client.end();
  }
})().catch((e) => { console.error('Seed failed:', e.message); process.exit(1); });

