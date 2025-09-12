import 'dotenv/config';
import { config as load } from 'dotenv';
load({ path: '.env.local' });

import { Client } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  const client = new Client({ connectionString: url });
  await client.connect();
  const res = await client.query(
    `select column_name, data_type, column_default
     from information_schema.columns
     where table_schema='public' and table_name='contact_requests'
     order by ordinal_position`
  );
  console.log('contact_requests columns:', res.rows);
  const res2 = await client.query(
    `select id, name, email, phone, status, created_at
     from contact_requests
     order by created_at desc
     limit 5`
  ).catch((e: unknown)=>{
    console.error('Select with status failed:', (e as Error).message);
    return { rows: [] } as { rows: unknown[] };
  });
  console.log('sample rows:', res2.rows);

  try {
    const mig = await client.query('select * from drizzle.__drizzle_migrations order by id');
    console.log('migrations in DB:', mig.rows);
  } catch (e) {
    console.error('cannot read drizzle migrations table:', (e as Error).message);
  }
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
